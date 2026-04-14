"use client";

import { motion } from "framer-motion";
import { Box, Headphones, Watch } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  status: "ACTIVE" | "PENDING";
  icon: React.ReactNode;
}

const products: Product[] = [
  { id: 1, name: "GADGET 1", price: "$149", status: "ACTIVE", icon: <Box className="w-5 h-5" /> },
  { id: 2, name: "GEAR 2", price: "$89", status: "PENDING", icon: <Headphones className="w-5 h-5" /> },
  { id: 3, name: "ACCESSORY 3", price: "$69", status: "ACTIVE", icon: <Watch className="w-5 h-5" /> },
];

export function ProductCards() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 40px rgba(45, 212, 191, 0.15)" 
              }}
              className="group relative rounded-2xl border border-[#1e3a32] bg-[#0d1f1a]/80 backdrop-blur-xl p-5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a2f28] flex items-center justify-center text-[#2dd4bf] group-hover:bg-[#2dd4bf]/20 transition-colors duration-300">
                  {product.icon}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">{product.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-400">View / Sync Status</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                    product.status === "ACTIVE"
                      ? "bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
