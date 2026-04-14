"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // <-- 1. Added the router import

export function CTA() {
  const router = useRouter(); // <-- 2. Initialized the router

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[400px] bg-[#2dd4bf]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-lg mb-4"
        >
          Shop Together
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8"
        >
          BUDDY-CART
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => router.push('/buddy-app')} // <-- 3. Added the click event to route to your app!
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full border border-[#2dd4bf] text-[#2dd4bf] font-medium hover:bg-[#2dd4bf]/10 transition-colors duration-300"
          >
            Start Shopping
          </motion.button>
          
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(45, 212, 191, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-[#2dd4bf] text-[#0a1612] font-medium hover:bg-[#26b8a5] transition-all duration-300"
          >
            Explore Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}