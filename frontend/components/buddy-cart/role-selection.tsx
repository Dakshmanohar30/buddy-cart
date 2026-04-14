"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Store } from "lucide-react";

export function RoleSelection() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 text-sm mb-2">Shop Together</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">BUDDY-CART</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h3 className="text-xl font-medium text-white">Role Selection</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Shopper Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 50px rgba(45, 212, 191, 0.2)"
            }}
            className="group cursor-pointer rounded-2xl border border-[#1e3a32] bg-[#0d1f1a]/80 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:border-[#2dd4bf]/50"
          >
            <div className="w-14 h-14 rounded-xl bg-[#1a2f28] flex items-center justify-center text-gray-400 group-hover:text-[#2dd4bf] group-hover:bg-[#2dd4bf]/20 mx-auto mb-4 transition-all duration-300">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Shopper Mode</h4>
            <p className="text-xs text-gray-400">Choose a buttons with ripple effects on hover</p>
          </motion.div>

          {/* Store Owner Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 0 50px rgba(45, 212, 191, 0.2)"
            }}
            className="group cursor-pointer rounded-2xl border border-[#1e3a32] bg-[#0d1f1a]/80 backdrop-blur-xl p-6 text-center transition-all duration-300 hover:border-[#2dd4bf]/50"
          >
            <div className="w-14 h-14 rounded-xl bg-[#1a2f28] flex items-center justify-center text-gray-400 group-hover:text-[#2dd4bf] group-hover:bg-[#2dd4bf]/20 mx-auto mb-4 transition-all duration-300">
              <Store className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Store Owner Mode</h4>
            <p className="text-xs text-gray-400">Choose a buttons with gloow effects on hover</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
