"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Users, ShoppingBag, Store as StoreIcon, User as UserIcon, Send, ShoppingCart, Calculator, MapPin, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const socket = io('http://localhost:5000');

export default function BuddyApp() {
  const [appMode, setAppMode] = useState(null); // 'shopper' or 'merchant'
  const [username, setUsername] = useState('');
  const [isShopperLoggedIn, setIsShopperLoggedIn] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [activeBuddies, setActiveBuddies] = useState([]);
  const [pairedBuddies, setPairedBuddies] = useState([]);
  const [activeStoresDb, setActiveStoresDb] = useState([]); 
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [joinErrorMsg, setJoinErrorMsg] = useState(null);
  const [messages, setMessages] = useState({}); 
  const [chatInputs, setChatInputs] = useState({});
  const [cartItems, setCartItems] = useState([]); 
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Merchant Portal State
  const [newStoreName, setNewStoreName] = useState('');
  const [newOffer, setNewOffer] = useState('');
  const [newOfferType, setNewOfferType] = useState('PERCENT');
  const [newOfferValue, setNewOfferValue] = useState(50);
  const [newBuyX, setNewBuyX] = useState(2);
  const [newGetY, setNewGetY] = useState(1);
  const [newMinItems, setNewMinItems] = useState(2);
  const [newLat, setNewLat] = useState(22.5726); 
  const [newLng, setNewLng] = useState(88.3639);

  const handleShopperNameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) setIsShopperLoggedIn(true);
  };

  useEffect(() => {
    if (appMode === 'shopper' && isShopperLoggedIn) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
          (err) => setLocationError("Please enable GPS/Location services.")
        );
      }
      axios.get('http://localhost:5000/api/stores')
        .then(res => setActiveStoresDb(res.data))
        .catch(err => console.error("Error fetching stores"));
    }
  }, [appMode, isShopperLoggedIn]);

  useEffect(() => {
    socket.on('update_buddies', (users) => setActiveBuddies(users.filter(u => u.username !== username)));
    socket.on('join_success', (store) => setCurrentStore(store));
    socket.on('join_error', (msg) => { setJoinErrorMsg(msg); setTimeout(() => setJoinErrorMsg(null), 5000); });
    socket.on('pairing_success', ({ pairedWithSocketId }) => setPairedBuddies(p => p.includes(pairedWithSocketId) ? p : [...p, pairedWithSocketId]));
    socket.on('receive_message', ({ fromSocketId, senderName, message }) => {
      setMessages(p => ({ ...p, [fromSocketId]: [...(p[fromSocketId] || []), { sender: senderName, text: message, isMine: false }] }));
    });
    socket.on('receive_cart_item', (item) => setCartItems(p => [...p, item]));

    return () => {
      socket.off('update_buddies'); socket.off('join_success'); socket.off('join_error');
      socket.off('pairing_success'); socket.off('receive_message'); socket.off('receive_cart_item');
    };
  }, [username]);

  const handleJoinStore = (storeName) => {
    if (!userLocation) return setJoinErrorMsg("Waiting for GPS... Please allow location access.");
    socket.emit('join_store', { storeName, username, userLat: userLocation.lat, userLng: userLocation.lng });
  };

  const handlePairUp = (buddySocketId) => socket.emit('pair_up', { targetSocketId: buddySocketId, fromUsername: username });

  const handleSendMessage = (e, targetSocketId) => {
    e.preventDefault();
    const text = chatInputs[targetSocketId];
    if (!text || !text.trim()) return;
    socket.emit('send_message', { toSocketId: targetSocketId, message: text, senderName: username });
    setMessages(prev => ({ ...prev, [targetSocketId]: [...(prev[targetSocketId] || []), { sender: 'Me', text: text, isMine: true }] }));
    setChatInputs(prev => ({ ...prev, [targetSocketId]: '' }));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const item = { owner: username, name: newItemName, price: Number(newItemPrice) };
    setCartItems(prev => [...prev, item]);
    pairedBuddies.forEach(buddyId => socket.emit('add_to_cart', { toSocketId: buddyId, item }));
    setNewItemName(''); setNewItemPrice('');
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/stores', {
        name: newStoreName, offerDetails: newOffer, offerType: newOfferType, offerValue: newOfferValue, 
        buyX: newBuyX, getY: newGetY, minItems: newMinItems, lat: Number(newLat), lng: Number(newLng)
      });
      alert("Store added!");
      setNewStoreName(''); setNewOffer('');
    } catch (err) { alert("Failed to add store."); }
  };

  const splitData = useMemo(() => {
    const activeStoreObj = activeStoresDb.find(s => s.name === currentStore);
    let totalValue = 0; 
    let finalBill = 0; 
    let userTotals = {};

    // 1. Calculate base totals for everyone
    cartItems.forEach(item => {
      if (!userTotals[item.owner]) userTotals[item.owner] = { value: 0, pays: 0 };
      userTotals[item.owner].value += item.price; 
      totalValue += item.price;
    });

    if (activeStoreObj && totalValue > 0) {
      if (activeStoreObj.offerType === 'BXGY') {
        // --- BULLETPROOF BUY X GET Y LOGIC ---
        const x = Number(activeStoreObj.buyX);
        const y = Number(activeStoreObj.getY);
        const groupSize = x + y;
        
        // Calculate exactly how many items the cart gets for free
        const freeItemsCount = Math.floor(cartItems.length / groupSize) * y;
        
        // Sort items ascending (cheapest first)
        const sortedPrices = cartItems.map(i => i.price).sort((a, b) => a - b);
        
        // The cheapest 'freeItemsCount' items cost 0. Sum the rest.
        finalBill = sortedPrices.reduce((acc, price, idx) => {
          return acc + (idx < freeItemsCount ? 0 : price);
        }, 0);

      } else {
        // --- PERCENTAGE OFF LOGIC ---
        // Only apply discount if the cart has AT LEAST the minItems required
        if (cartItems.length >= Number(activeStoreObj.minItems)) {
          finalBill = totalValue * (1 - (Number(activeStoreObj.offerValue) / 100));
        } else {
          finalBill = totalValue; // Not enough items, pay full price
        }
      }
    }

    // 3. Split the final discounted bill fairly based on who added what
    const ratio = totalValue > 0 ? finalBill / totalValue : 1;
    Object.keys(userTotals).forEach(user => {
      userTotals[user].pays = userTotals[user].value * ratio;
    });

    return { totalValue, finalBill, userTotals };
  }, [cartItems, activeStoresDb, currentStore]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden text-white font-sans"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #020617 40%, #022c22 100%)' }}
    >
      {/* MODE SELECTOR (Replaces old landing page HTML) */}
      {!appMode && (
        <div className="flex flex-col items-center gap-6 z-10">
          <h2 className="text-3xl font-bold">Launch App As:</h2>
          <div className="flex gap-4">
             <button onClick={() => setAppMode('shopper')} className="px-8 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400">Shopper</button>
             <button onClick={() => setAppMode('merchant')} className="px-8 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400">Merchant</button>
          </div>
          <Link href="/" className="mt-8 text-gray-400 hover:text-white underline">← Back to Main Landing Page</Link>
        </div>
      )}

      {/* --- SHOPPER NAME SETUP --- */}
      {appMode === 'shopper' && !isShopperLoggedIn && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md z-10 px-4">
          <button onClick={() => setAppMode(null)} className="mb-8 text-gray-400 hover:text-[#4ade80] transition-colors font-medium">← Back</button>
          <h2 className="text-4xl font-extrabold mb-3 text-white tracking-tight">Shopper Profile</h2>
          <p className="text-gray-400 mb-8 text-lg">Enter a name so your buddies know who you are.</p>

          <form onSubmit={handleShopperNameSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <UserIcon className="absolute left-5 top-5 text-[#4ade80]" size={22} />
              <input type="text" placeholder="Your Display Name" value={username} onChange={(e) => setUsername(e.target.value)} 
                className="w-full p-5 pl-14 rounded-2xl bg-white/5 text-white outline-none focus:border-[#4ade80] border border-white/10 transition-colors shadow-lg backdrop-blur-md text-lg" required />
            </div>
            <button type="submit" className="py-5 bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-black rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
              Find Deals
            </button>
          </form>
        </motion.div>
      )}

      {/* --- MERCHANT PORTAL --- */}
      {appMode === 'merchant' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg z-10 px-4 py-12">
          <button onClick={() => setAppMode(null)} className="mb-6 text-gray-400 hover:text-blue-400 transition-colors font-medium">← Back</button>
          <h2 className="text-4xl font-extrabold mb-3 text-white tracking-tight">Merchant Dashboard</h2>
          <form onSubmit={handleAddStore} className="flex flex-col gap-5 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            <input type="text" placeholder="Store Name" value={newStoreName} onChange={(e) => setNewStoreName(e.target.value)} className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none transition-colors" required />
            <input type="text" placeholder="Offer Title" value={newOffer} onChange={(e) => setNewOffer(e.target.value)} className="p-4 rounded-xl bg-black/40 text-white border border-white/10 focus:border-blue-500 outline-none transition-colors" required />
            
            {/* OFFER TYPE DROPDOWN */}
            <select value={newOfferType} onChange={(e) => setNewOfferType(e.target.value)} className="p-4 rounded-xl bg-black/40 text-white outline-none border border-white/10 focus:border-blue-500 transition-colors [&>option]:bg-[#020617]">
              <option value="PERCENT">Percentage Off (%)</option>
              <option value="BXGY">Buy X Get Y Free</option>
            </select>

            {/* --- CONDITIONAL INPUTS: PERCENTAGE OFF --- */}
            {newOfferType === 'PERCENT' && (
              <div className="flex gap-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex-1">
                  <label className="text-xs text-blue-400 font-bold uppercase block mb-2">Discount Percentage</label>
                  <input type="number" min="1" max="100" placeholder="e.g., 30 for 30%" value={newOfferValue} onChange={(e) => setNewOfferValue(e.target.value)} className="w-full p-3 rounded-lg bg-black/40 text-white outline-none border border-white/5 focus:border-blue-500 transition-colors" required />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-blue-400 font-bold uppercase block mb-2">Min. Items to Buy</label>
                  <input type="number" min="1" placeholder="e.g., 3 items" value={newMinItems} onChange={(e) => setNewMinItems(e.target.value)} className="w-full p-3 rounded-lg bg-black/40 text-white outline-none border border-white/5 focus:border-blue-500 transition-colors" required />
                </div>
              </div>
            )}

            {/* --- CONDITIONAL INPUTS: BUY X GET Y --- */}
            {newOfferType === 'BXGY' && (
              <div className="flex gap-4 p-5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl">
                <div className="flex-1">
                  <label className="text-xs text-[#4ade80] font-bold uppercase block mb-2">Buy Quantity (X)</label>
                  <input type="number" min="1" placeholder="e.g., 2" value={newBuyX} onChange={(e) => setNewBuyX(e.target.value)} className="w-full p-3 rounded-lg bg-black/40 text-white outline-none border border-white/5 focus:border-[#4ade80] transition-colors" required />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[#4ade80] font-bold uppercase block mb-2">Get Free (Y)</label>
                  <input type="number" min="1" placeholder="e.g., 1" value={newGetY} onChange={(e) => setNewGetY(e.target.value)} className="w-full p-3 rounded-lg bg-black/40 text-white outline-none border border-white/5 focus:border-[#4ade80] transition-colors" required />
                </div>
              </div>
            )}

            <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Latitude</label>
                  <input type="number" step="any" placeholder="Lat" value={newLat} onChange={(e) => setNewLat(e.target.value)} className="w-full p-3 rounded-lg bg-black/40 text-white text-sm outline-none border border-white/5 focus:border-gray-400" required />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Longitude</label>
                  <input type="number" step="any" placeholder="Lng" value={newLng} onChange={(e) => setNewLng(e.target.value)} className="w-full p-3 rounded-lg bg-black/40 text-white text-sm outline-none border border-white/5 focus:border-gray-400" required />
                </div>
            </div>
            <button type="submit" className="py-4 mt-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">Publish Live Offer</button>
          </form>
        </motion.div>
      )}

      {/* --- SHOPPER ACTIVE OFFERS --- */}
      {appMode === 'shopper' && isShopperLoggedIn && !currentStore && (
        <div className="w-full max-w-md flex flex-col items-center z-10 px-4 py-12">
          <h2 className="text-4xl font-extrabold mb-2 text-white tracking-tight">Welcome, {username}!</h2>
          <p className="text-gray-400 mb-8 text-lg">Locating deals securely near you...</p>

          {locationError && <div className="mb-6 p-4 w-full bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400"><AlertTriangle size={20} /> {locationError}</div>}
          {joinErrorMsg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 w-full bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl flex items-center gap-3 text-sm text-[#4ade80] font-medium"><MapPin size={20} /> {joinErrorMsg}</motion.div>}
          
          <div className="w-full space-y-4">
            {activeStoresDb.length === 0 ?
              <p className="text-center text-gray-500 p-8 bg-white/5 rounded-2xl border border-white/10">No active store offers in database.</p> : activeStoresDb.map(store => (
                <button key={store._id} onClick={() => handleJoinStore(store.name)} className="w-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-start gap-3 hover:border-[#22c55e]/50 hover:bg-white/10 transition-all shadow-lg group">
                  <span className="text-2xl font-bold text-white group-hover:text-[#4ade80] transition-colors">{store.name}</span>
                  <span className="bg-[#22c55e]/10 text-[#4ade80] border border-[#22c55e]/20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">🔥 {store.offerDetails}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* --- BUDDY ROOM & CART --- */}
      {appMode === 'shopper' && isShopperLoggedIn && currentStore && (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 z-10 px-6 py-8">
         
         <div className="w-full lg:w-1/2 flex flex-col gap-4">
           <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
             <div><p className="text-xs text-[#4ade80] font-bold uppercase tracking-widest mb-1">Location Verified</p><h2 className="text-2xl font-bold text-white">{currentStore}</h2></div>
             <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full font-semibold flex items-center gap-2"><Users size={18} /> {activeBuddies.length} Buddies</div>
           </div>
           
           <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
             <AnimatePresence>
               {activeBuddies.map((buddy) => {
                 const isPaired = pairedBuddies.includes(buddy.socketId);
                 return (
                   <motion.div key={buddy.socketId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-2xl backdrop-blur-xl border transition-all ${isPaired ? "bg-[#22c55e]/10 border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                     <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-black text-lg ${isPaired ? "bg-[#4ade80]" : "bg-blue-400"}`}>{buddy.username.charAt(0).toUpperCase()}</div>
                         <div><h4 className="text-xl font-bold text-white">{buddy.username}</h4></div>
                       </div>
                       <button onClick={() => handlePairUp(buddy.socketId)} disabled={isPaired} className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${isPaired ? "bg-[#22c55e]/20 text-[#4ade80] cursor-not-allowed" : "bg-white text-black hover:bg-gray-200 shadow-lg"}`}>
                         {isPaired ? "Paired" : "Pair Up"}
                       </button>
                     </div>
                     
                     {isPaired && (
                       <div className="mt-5 bg-black/40 rounded-xl p-5 border border-white/5 shadow-inner">
                         <div className="h-40 overflow-y-auto mb-4 flex flex-col gap-3 pr-2">
                           {messages[buddy.socketId]?.length ? messages[buddy.socketId].map((msg, idx) => (
                             <div key={idx} className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
                               <span className="text-[10px] text-gray-500 mb-1">{msg.sender}</span>
                               <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.isMine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>{msg.text}</div>
                             </div>
                           )) : <p className="text-center text-gray-600 text-sm mt-auto mb-auto">Say hello and coordinate your cart!</p>}
                         </div>
                         <form onSubmit={(e) => handleSendMessage(e, buddy.socketId)} className="flex gap-2">
                           <input type="text" placeholder="Type a message..." value={chatInputs[buddy.socketId] || ''} onChange={(e) => setChatInputs({ ...chatInputs, [buddy.socketId]: e.target.value })} className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-blue-500 transition-colors text-white" />
                           <button type="submit" className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition-colors"><Send size={18} className="text-white" /></button>
                         </form>
                       </div>
                     )}
                   </motion.div>
                 );
               })}
             </AnimatePresence>
           </div>
         </div>

         {pairedBuddies.length > 0 && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-1/2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-7 flex flex-col h-full shadow-2xl">
             <div className="flex items-center gap-3 mb-6"><ShoppingCart className="text-[#4ade80]" size={28} /><h2 className="text-2xl font-bold text-white tracking-tight">Shared Cart</h2></div>
             
             <form onSubmit={handleAddToCart} className="flex gap-3 mb-6">
               <input type="text" placeholder="Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="flex-2 bg-black/40 rounded-xl px-4 py-3 outline-none w-1/2 border border-white/10 focus:border-[#4ade80] text-white transition-colors" required />
               <input type="number" placeholder="Price" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="flex-1 bg-black/40 rounded-xl px-4 py-3 outline-none w-1/4 border border-white/10 focus:border-[#4ade80] text-white transition-colors" required />
               <button type="submit" className="bg-white text-black font-bold px-6 rounded-xl hover:bg-gray-200 transition-colors shadow-md">Add</button>
             </form>
             
             <div className="flex-1 overflow-y-auto mb-6 space-y-2 border-y border-white/10 py-5 min-h-[200px]">
               {cartItems.length ? cartItems.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                   <div><span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mr-3 bg-blue-400/10 px-2 py-1 rounded">{item.owner}</span><span className="font-medium text-white">{item.name}</span></div>
                   <span className="font-bold text-gray-200">₹{item.price}</span>
                 </div>
               )) : <p className="text-center text-gray-500 mt-10">Cart is empty. Add items to see the split!</p>}
             </div>
             
             <div className="bg-[#22c55e]/5 p-6 rounded-2xl border border-[#22c55e]/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
               <div className="flex items-center gap-2 mb-5"><Calculator className="text-[#4ade80]" size={20} /><h3 className="text-xl font-bold text-white">Dynamic Fair Split</h3></div>
               <div className="flex justify-between text-sm text-gray-400 mb-2"><span>Total Base Value:</span><span>₹{splitData.totalValue}</span></div>
               <div className="flex justify-between text-xl font-bold mb-6 pb-5 border-b border-white/10 text-white"><span>Final Discounted Bill:</span><span className="text-[#4ade80]">₹{splitData.finalBill}</span></div>
               <div className="space-y-3">
                 {Object.keys(splitData.userTotals).map(user => (
                   <div key={user} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                     <span className="font-medium text-gray-300">{user} Pays:</span><span className="font-bold text-[#4ade80] text-xl tracking-tight">₹{Math.round(splitData.userTotals[user].pays)}</span>
                   </div>
                 ))}
               </div>
             </div>
           </motion.div>
         )}
       </motion.div>
      )}
    </div>
  );
}