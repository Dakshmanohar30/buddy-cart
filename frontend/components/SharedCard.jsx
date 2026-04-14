"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { ShoppingBag, Users } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function SharedCart({ storeName }) {
  const [buddies, setBuddies] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    socket.emit('join_store', { storeName, user: { name: "You" } });
    socket.on('update_buddies', (activeUsers) => setBuddies(activeUsers));
    socket.on('cart_updated', (newItem) => setCartItems(prev => [...prev, newItem]));
    return () => socket.off(); 
  }, [storeName]);

  const handleAddItem = () => {
    const item = { id: Date.now(), name: "Zara Basic T-Shirt", price: 1500 };
    setCartItems(prev => [...prev, item]); 
    socket.emit('add_to_cart', { storeName, item });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-brandPink" /> {storeName} Buddies: {buddies.length}
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[200px]">
        <h3 className="text-lg text-gray-400 mb-4 flex items-center gap-2">
          <ShoppingBag size={20}/> Shared Cart (Buy 2 Get 50% Off)
        </h3>
        
        <div className="space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="p-4 bg-gradient-to-r from-brandPurple/20 to-brandPink/20 rounded-xl border border-white/10 flex justify-between items-center"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-green-400 font-bold">₹{item.price}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="mt-6 w-full py-3 border-2 border-brandPurple text-brandPurple rounded-xl font-bold hover:bg-brandPurple hover:text-white transition-colors"
        >
          + Add Item to Shared Cart
        </motion.button>
      </div>
    </div>
  );
}