import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import MeshBackground from './components/UI/MeshBackground';
import Hero from './components/Sections/Hero';
import Evolution from './components/Sections/Evolution';
import BentoGrid from './components/Sections/BentoGrid';
import GameArena from './components/Sections/GameArena';

export default function App() {
  const evolutionRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll progress bar for the entire page
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToEvolution = () => {
    evolutionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Ensure scroll restoration is at top on refresh
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative selection:bg-accent-cyan selection:text-nightfall-950">
      {/* Global Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-red z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Dynamic Background */}
      <MeshBackground />
      
      <main>
        {/* Cinematic Intro */}
        <Hero onStart={scrollToEvolution} />
        
        {/* Section 4.1: The Theory Timeline */}
        <div ref={evolutionRef}>
          <Evolution />
        </div>
        
        {/* Section 4.2: The Bento Characteristics */}
        <BentoGrid />
        
        {/* The Final Arena */}
        <GameArena />
      </main>
      
      {/* Footer / Knowledge Credits */}
      <footer className="relative py-24 text-center border-t border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-accent-cyan font-black text-2xl tracking-tighter">
              Đại Chiến <span className="text-white">Độc Quyền</span>
            </div>
            
            <p className="text-slate-500 text-sm md:text-base max-w-lg leading-relaxed font-medium">
              Kiến thức được biên soạn dựa trên Giáo trình Kinh tế Chính trị Mác-Lênin (Hội đồng Trung ương chỉ đạo biên soạn). 
              Thiết kế bởi Senior UX Presentation Engine.
            </p>
            
            <div className="flex items-center gap-10 text-[10px] md:text-xs font-black tracking-[0.4em] text-slate-700 uppercase">
              <span>Hà Nội</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Chương 04</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>2026 Edition</span>
            </div>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 text-slate-500 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black"
            >
              Về đầu trang ↑
            </button>
          </motion.div>
        </div>
        
        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent" />
      </footer>
    </div>
  );
}
