"use client";
import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const mapContainerStyle = { width: '100%', height: '300px', borderRadius: '16px' };
const defaultCenter = { lat: 22.5726, lng: 88.3639 };

export default function StoreMap({ onJoinStore }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // ⚠️ Paste your actual API key here!
  });

  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyStores, setNearbyStores] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => console.log("Geolocation permission denied")
      );
    }
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNearbyStores([
        { id: 1, name: "Zara", distance: "12m away" },
        { id: 2, name: "H&M", distance: "45m away" }
      ]);
      setIsScanning(false);
    }, 1500);
  };

  if (!isLoaded) return <div className="text-white animate-pulse">Loading Map...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
      <div className="p-2 bg-white/5 rounded-2xl border border-white/10 mb-6">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={16} center={currentLocation}>
          <Marker position={currentLocation} />
          <Circle center={currentLocation} radius={100} options={{ fillColor: '#ec4899', fillOpacity: 0.2, strokeColor: '#ec4899', strokeOpacity: 0.8, strokeWeight: 2 }} />
        </GoogleMap>
      </div>

      {!nearbyStores.length > 0 ? (
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-full py-4 bg-gradient-to-r from-brandPurple to-brandPink rounded-xl font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
        >
          {isScanning ? "Scanning Area..." : "Scan For Nearby Stores 📍"}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-xl font-bold text-gray-300">Stores in your radius:</h3>
          {nearbyStores.map(store => (
            <button 
              key={store.id}
              onClick={() => onJoinStore(store.name)} 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xl font-bold block text-left">{store.name}</span>
                <span className="text-sm text-brandPink">{store.distance}</span>
              </div>
              <MapPin className="text-brandPink group-hover:scale-125 transition-transform" />
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}