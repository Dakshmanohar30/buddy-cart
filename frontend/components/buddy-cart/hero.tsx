"use client";

import { motion } from "framer-motion";
import { FloatingParticles } from "./floating-particles";
import { AppMockup } from "./app-mockup";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1612] via-[#0d1f1a] to-[#0a1612]" />
      
      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              <span className="text-balance">Shop Together.</span>
              <br />
              <span className="text-balance">In Real Time.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-6 text-lg text-gray-400 max-w-md mx-auto lg:mx-0"
            >
              Buddy-Cart lets you sync carts, chat live, and shop with friends seamlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() => router.push('/buddy-app')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full border border-[#2dd4bf] text-[#2dd4bf] font-medium hover:bg-[#2dd4bf]/10 transition-colors duration-300"
              >
                Start Shopping
              </motion.button>
              
              <motion.button
                // 👇 Added the smooth scroll onClick event here!
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45, 212, 191, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-[#2dd4bf] text-[#0a1612] font-medium hover:bg-[#26b8a5] transition-all duration-300"
              >
                Explore Features
              </motion.button>
            </motion.div>
          </div>

          {/* Right side - App mockups */}
          <div>
            <AppMockup />
          </div>
        </div>
      </div>
    </section>
  );
}