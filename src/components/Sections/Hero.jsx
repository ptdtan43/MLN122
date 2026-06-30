import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onStart }) {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pb-32 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-cyan font-bold tracking-[0.1em] md:tracking-[0.15em] uppercase text-[10px] md:text-xs mb-6 md:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          Giáo trình Kinh tế Chính trị Mác-Lênin
        </motion.div>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold text-gradient-white leading-[1] mb-6 md:mb-8 select-none tracking-tight">
          Đại Chiến<br />Độc Quyền
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-xl mx-auto text-slate-400 text-sm md:text-base lg:text-lg mb-8 md:mb-12 leading-relaxed font-medium px-2"
        >
          Chương 4: Từ Tự do Cạnh tranh đến Chủ nghĩa Tư bản Độc quyền. 
          Hành trình lịch sử của sự tập trung sản xuất và sức mạnh tài chính.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button 
            onClick={onStart}
            className="btn-primary group"
          >
            <span className="relative z-10 flex items-center gap-3">
              Bắt đầu khám phá
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </motion.svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-accent-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      </motion.div>
      
      {/* Cinematic scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Cuộn để bắt đầu</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent-cyan/50 to-transparent" />
      </motion.div>
    </section>
  );
}
