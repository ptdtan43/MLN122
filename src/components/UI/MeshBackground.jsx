import React from 'react';
import { motion } from 'framer-motion';

export default function MeshBackground({ variant = 'default' }) {
  const isGame = variant === 'game';
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-[10%] -left-[10%] w-[60%] h-[60%] blur-[100px] rounded-full will-change-transform ${
          isGame ? 'bg-red-600/20' : 'bg-accent-cyan/15'
        }`}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] blur-[100px] rounded-full will-change-transform ${
          isGame ? 'bg-purple-800/20' : 'bg-accent-violet/15'
        }`}
      />
      <div className="absolute inset-0 bg-nightfall-950/20 backdrop-brightness-50" />
    </div>
  );
}
