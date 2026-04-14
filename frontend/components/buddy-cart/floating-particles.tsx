"use client";

import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
}

export function FloatingParticles() {
  const particles: Particle[] = [
    { id: 1, x: "10%", y: "20%", size: 8, delay: 0, duration: 6 },
    { id: 2, x: "85%", y: "15%", size: 12, delay: 1, duration: 7 },
    { id: 3, x: "70%", y: "60%", size: 6, delay: 0.5, duration: 5 },
    { id: 4, x: "20%", y: "70%", size: 10, delay: 2, duration: 8 },
    { id: 5, x: "90%", y: "80%", size: 8, delay: 1.5, duration: 6 },
    { id: 6, x: "5%", y: "50%", size: 14, delay: 0.8, duration: 7 },
    { id: 7, x: "50%", y: "10%", size: 6, delay: 2.5, duration: 5 },
    { id: 8, x: "30%", y: "85%", size: 10, delay: 1.2, duration: 6 },
    { id: 9, x: "60%", y: "30%", size: 8, delay: 0.3, duration: 7 },
    { id: 10, x: "95%", y: "45%", size: 12, delay: 1.8, duration: 8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            background: "radial-gradient(circle, #2dd4bf 0%, transparent 70%)",
            boxShadow: `0 0 ${particle.size * 3}px ${particle.size}px rgba(45, 212, 191, 0.3)`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
