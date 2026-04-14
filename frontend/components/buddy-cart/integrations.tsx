"use client";

import { motion } from "framer-motion";
import { Code2, Github, Code, Settings } from "lucide-react";

const integrations = [
  { icon: <span className="text-[#3178c6] font-bold text-lg">TS</span>, name: "TypeScript" },
  { icon: <Github className="w-6 h-6" />, name: "GitHub" },
  { icon: <Code className="w-6 h-6" />, name: "Code" },
  { icon: <Settings className="w-6 h-6" />, name: "Settings" },
];

export function Integrations() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-white">Integrations</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 30px rgba(45, 212, 191, 0.2)"
              }}
              className="w-14 h-14 rounded-xl border border-[#1e3a32] bg-[#0d1f1a]/80 backdrop-blur-xl flex items-center justify-center text-gray-400 hover:text-[#2dd4bf] hover:border-[#2dd4bf]/30 transition-all duration-300 cursor-pointer"
            >
              {integration.icon}
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative Star */}
        <motion.div
          initial={{ opacity: 0, rotate: -45 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-10 right-10 text-gray-600"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
