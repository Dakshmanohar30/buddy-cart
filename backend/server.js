const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const dns = require('dns');
require('dotenv').config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(cors());
app.use(express.json()); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } // Updated to Next.js default port 3000
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Successfully Connected!"))
  .catch((error) => console.error("❌ Error connecting to MongoDB:", error.message));

// --- STORE SCHEMA ---
const storeSchema = new mongoose.Schema({
  name: String,
  offerDetails: String, 
  offerType: { type: String, default: 'PERCENT' }, 
  offerValue: { type: Number, default: 50 }, 
  buyX: { type: Number, default: 2 }, 
  getY: { type: Number, default: 1 }, 
  minItems: { type: Number, default: 1 }, 
  lat: Number, 
  lng: Number, 
  isActive: { type: Boolean, default: true }
});

const Store = mongoose.model('Store', storeSchema);

// --- STORE APIS ---
app.post('/api/stores', async (req, res) => {
  try {
    const { name, offerDetails, offerType, offerValue, buyX, getY, minItems, lat, lng } = req.body;
    const newStore = new Store({ name, offerDetails, offerType, offerValue, buyX, getY, minItems, lat, lng });
    await newStore.save();
    res.status(201).json({ message: "Store added successfully!", store: newStore });
  } catch (error) {
    res.status(500).json({ error: "Failed to add store" });
  }
});

app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true });
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// --- THE HAVERSINE FORMULA ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
};

// --- SOCKET.IO ---
const storeRooms = {};

io.on('connection', (socket) => {
  socket.on('join_store', async ({ storeName, username, userLat, userLng }) => {
    try {
      const store = await Store.findOne({ name: storeName });
      if (!store) return socket.emit('join_error', "Store not found.");
      const distanceInMeters = calculateDistance(userLat, userLng, store.lat, store.lng);
      
      if (distanceInMeters > 200) {
        return socket.emit('join_error', `You are ${Math.round(distanceInMeters)} meters away. You must be at the store to join.`);
      }

      socket.join(storeName);
      if (!storeRooms[storeName]) storeRooms[storeName] = [];
      storeRooms[storeName].push({ socketId: socket.id, username: username, lat: userLat, lng: userLng });
      
      io.to(storeName).emit('update_buddies', storeRooms[storeName]);
      socket.emit('join_success', storeName);
    } catch (error) {
      socket.emit('join_error', "Server error verifying location.");
    }
  });

  socket.on('pair_up', ({ targetSocketId, fromUsername }) => {
    io.to(targetSocketId).emit('pairing_success', { pairedWithSocketId: socket.id });
    socket.emit('pairing_success', { pairedWithSocketId: targetSocketId });
  });

  socket.on('send_message', ({ toSocketId, message, senderName }) => {
    io.to(toSocketId).emit('receive_message', { fromSocketId: socket.id, senderName, message });
  });

  socket.on('add_to_cart', ({ toSocketId, item }) => {
    io.to(toSocketId).emit('receive_cart_item', item);
  });

  socket.on('disconnect', () => {
    for (const storeName in storeRooms) {
      const initialLength = storeRooms[storeName].length;
      storeRooms[storeName] = storeRooms[storeName].filter(user => user.socketId !== socket.id);
      if (storeRooms[storeName].length !== initialLength) {
        io.to(storeName).emit('update_buddies', storeRooms[storeName]);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));