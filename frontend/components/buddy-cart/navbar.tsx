"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";

const navLinks = ["Features", "Solutions", "Pricing", "Login"];

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between rounded-full border border-[#1e3a32] bg-[#0d1f1a]/80 backdrop-blur-xl px-6 py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-lg font-bold text-white tracking-wider cursor-pointer"
          >
            BUDDY-CART
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ color: "#2dd4bf", scale: 1.05 }}
                className="text-sm text-gray-300 hover:text-[#2dd4bf] transition-colors duration-200 cursor-pointer"
              >
                {link}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-gray-300 hover:text-[#2dd4bf] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
