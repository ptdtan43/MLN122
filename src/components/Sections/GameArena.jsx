import React from 'react';
import { motion } from 'framer-motion';
import Game from '../Game/Game';
import { Swords, Zap } from 'lucide-react';

export default function GameArena() {
  return (
    <section className="relative min-h-screen py-32 px-4 md:px-6 flex flex-col items-center justify-center overflow-hidden">
      {/* Intense Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-nightfall-950 via-[#1e0101] to-[#0a0000] -z-20" />
      
      {/* Animated Mesh Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [-20, 20, -20],
          y: [-20, 20, -20]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-red-600/20 blur-[150px] rounded-full -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
          x: [20, -20, 20],
          y: [20, -20, 20]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full -z-10" 
      />
      
      {/* Floating Embers - Optimized count */}
      <div className="absolute inset-0 opacity-40 pointer-events-none -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110%", x: Math.random() * 100 + "%" }}
            animate={{ 
              y: "-10%", 
              opacity: [0, 1, 0],
              x: (Math.random() - 0.5) * 100 + "%" 
            }}
            transition={{ 
              duration: Math.random() * 4 + 8, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-[2px] h-[2px] bg-red-500 rounded-full blur-[1px] shadow-[0_0_5px_#ef4444] transform-gpu"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="w-full max-w-7xl relative z-10"
      >
        <div className="text-center mb-20">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-black tracking-[0.2em] uppercase text-xs mb-8 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            Vùng Chiến Sự: Arena Độc Quyền
          </motion.div>
          
          <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            Đại Chiến <span className="text-red-600">Boss</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Vận dụng toàn bộ vũ khí lý luận đã học để giải mã mâu thuẫn và chiến thắng 3 giai đoạn tiến hóa của độc quyền.
          </p>
        </div>

        {/* Dramatic Game Container */}
        <div className="relative w-full max-w-5xl mx-auto glass-card border-red-600/10 shadow-[0_0_100px_rgba(239,68,68,0.05)] overflow-hidden">
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-red-600/30 rounded-tl-3xl m-2 md:m-4 pointer-events-none z-20" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-red-600/30 rounded-tr-3xl m-2 md:m-4 pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-red-600/30 rounded-bl-3xl m-2 md:m-4 pointer-events-none z-20" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-red-600/30 rounded-br-3xl m-2 md:m-4 pointer-events-none z-20" />

          {/* Embedded Game UI */}
          <div className="py-12 px-4 md:px-12 flex items-center justify-center bg-black/40">
             <Game />
          </div>
        </div>
        
        <div className="mt-16 flex justify-center gap-10 text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase opacity-50">
          <span>Phase 03: Global Dominance</span>
          <span>•</span>
          <span>Educational Battle 2026</span>
        </div>
      </motion.div>
    </section>
  );
}
