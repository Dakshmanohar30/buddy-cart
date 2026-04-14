"use client";

import { motion, Variants } from "framer-motion";
import { 
  RefreshCw, 
  MessageSquare, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Sparkles 
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Real-time sync",
    description: "Buddy-Cart lets you sync carts, chat live.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Live chat",
    description: "Buddy-Cart lets you sync carts, chat live.",
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    title: "Multi-checkout",
    description: "D-ultra-triple-account and multi-lipe-checkout.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Fast API",
    description: "Fast API for conecting with incinere/actions.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Secure backend",
    description: "Secure backend, and secure backend.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Smooth animations",
    description: "Smooth animations for smeany and animations.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Features() {
  return (
    // 👇 Notice the id="features" added right here!
    <section id="features" className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 30px rgba(45, 212, 191, 0.1)"
              }}
              className="group rounded-2xl border border-[#1e3a32] bg-[#0d1f1a]/80 backdrop-blur-xl p-5 transition-all duration-300 hover:border-[#2dd4bf]/30"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1a2f28] flex items-center justify-center text-gray-400 group-hover:text-[#2dd4bf] group-hover:bg-[#2dd4bf]/20 mb-4 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}