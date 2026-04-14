"use client";

import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, Users, RefreshCw, Search } from "lucide-react";

export function AppMockup() {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px]">
      {/* Main App Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: [0, -5, 0],
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
          scale: { duration: 0.8, delay: 0.3, ease: "easeOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 60px rgba(45, 212, 191, 0.2)"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[400px] rounded-2xl border border-[#1e3a32] bg-[#0d1f1a]/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-[#2dd4bf]/10"
      >
        {/* App Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e3a32]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium text-white">BUDDY-CART</span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* App Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-24 border-r border-[#1e3a32] p-3 space-y-4">
            <div className="flex flex-col items-center gap-1 text-[#2dd4bf]">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-[10px]">Solutions</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px]">Carts</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3">
            <div className="text-xs text-gray-400 mb-2">Cart Cart:</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1a2f28]">
                <div className="w-8 h-8 rounded bg-[#2dd4bf]/20 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-[#2dd4bf]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-white">Gadget 1</div>
                  <div className="text-[10px] text-gray-400">$149</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1a2f28]">
                <div className="w-8 h-8 rounded bg-[#2dd4bf]/20 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-[#2dd4bf]" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-white">Accessory 2</div>
                  <div className="text-[10px] text-gray-400">$149</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="w-28 border-l border-[#1e3a32] p-2">
            <div className="text-[10px] text-white mb-2">Quat chat</div>
            <div className="space-y-2">
              <div className="p-1.5 rounded bg-[#1a2f28]">
                <div className="text-[8px] text-gray-300">Should we add more items?</div>
              </div>
              <div className="p-1.5 rounded bg-[#2dd4bf]/20">
                <div className="text-[8px] text-[#2dd4bf]">Yes, let&apos;s do it!</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Chat Floating Card - Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: [0, -10, 0],
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.6, ease: "easeOut" },
          x: { duration: 0.8, delay: 0.6, ease: "easeOut" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-20 left-0 w-36 rounded-xl border border-[#1e3a32] bg-[#0d1f1a]/90 backdrop-blur-xl p-3 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#2dd4bf]/20 flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-[#2dd4bf]" />
          </div>
          <span className="text-[10px] font-medium text-white">LIVE CHAT</span>
        </div>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-[#2dd4bf] border-2 border-[#0d1f1a]" />
          <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-[#0d1f1a]" />
          <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-[#0d1f1a]" />
        </div>
      </motion.div>

      {/* Friend's View Floating Card - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: [0, -8, 0],
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.8, ease: "easeOut" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        className="absolute bottom-10 left-0 w-40 rounded-xl border border-[#1e3a32] bg-[#0d1f1a]/90 backdrop-blur-xl p-3 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf]">FRIEND&apos;S VIEW</span>
        </div>
        <div className="text-[10px] text-gray-400">Gadget 1 —</div>
        <div className="text-xs text-white font-medium">$149</div>
        <div className="text-[10px] text-white mt-1">Product Detail</div>
        <div className="text-[8px] text-gray-400">5 variations</div>
        <div className="mt-2 text-[8px] px-2 py-1 rounded bg-[#2dd4bf]/20 text-[#2dd4bf] inline-block">
          Sync INACTIVE
        </div>
      </motion.div>

      {/* Sync Status Floating Card - Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          y: [0, -12, 0],
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.7, ease: "easeOut" },
          x: { duration: 0.8, delay: 0.7, ease: "easeOut" },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
        className="absolute top-1/3 right-0 w-36 rounded-xl border border-[#1e3a32] bg-[#0d1f1a]/90 backdrop-blur-xl p-3 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2dd4bf]/20 text-[#2dd4bf]">SYNC STATUS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#2dd4bf]/20 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-[#2dd4bf]" />
          </div>
          <div>
            <div className="text-[10px] text-white">Tech Product io</div>
            <div className="text-[8px] text-gray-400">Real-time support</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
