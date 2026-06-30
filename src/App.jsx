import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import MeshBackground from './components/UI/MeshBackground';
import Hero from './components/Sections/Hero';
import Evolution from './components/Sections/Evolution';
import BentoGrid from './components/Sections/BentoGrid';
import GameArena from './components/Sections/GameArena';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef(null);
  const evolutionRef = useRef(null);
  const bentoRef = useRef(null);
  const arenaRef = useRef(null);

  const sections = [
    { id: 'hero', name: 'Trang chủ', ref: heroRef },
    { id: 'evolution', name: 'Sự tiến hóa', ref: evolutionRef },
    { id: 'bento', name: 'Đặc điểm', ref: bentoRef },
    { id: 'arena', name: 'Đại chiến Boss', ref: arenaRef }
  ];

  const { scrollYProgress } = useScroll();

  // Smooth scroll progress bar for the entire page
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Track active section on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

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

      {/* Right side dot navigation (Scrollspy) */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.ref)}
            className="group relative flex items-center justify-end"
            aria-label={section.name}
          >
            {/* Tooltip */}
            <span className="absolute right-8 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] sm:text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-xl tracking-wide uppercase">
              {section.name}
            </span>
            {/* Dot */}
            <div className={`
              w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border transition-all duration-300
              ${activeSection === section.id 
                ? 'bg-accent-cyan border-accent-cyan scale-125 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                : 'bg-black/50 border-white/30 hover:border-white/80 hover:bg-white/10'}
            `} />
          </button>
        ))}
      </div>

      {/* Dynamic Background */}
      <MeshBackground />

      <main>
        {/* Cinematic Intro */}
        <div ref={heroRef} id="hero">
          <Hero onStart={() => scrollTo(evolutionRef)} />
        </div>

        {/* Section 4.1: The Theory Timeline */}
        <div ref={evolutionRef} id="evolution">
          <Evolution />
        </div>

        {/* Section 4.2: The Bento Characteristics */}
        <div ref={bentoRef} id="bento">
          <BentoGrid />
        </div>

        {/* The Final Arena */}
        <div ref={arenaRef} id="arena">
          <GameArena />
        </div>
      </main>

      {/* Footer / Knowledge Credits */}
      <footer className="relative py-16 md:py-24 text-center border-t border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-accent-cyan font-black text-2xl tracking-tight">
              Đại Chiến <span className="text-white">Độc Quyền</span>
            </div>

            <p className="text-slate-500 text-sm md:text-base max-w-lg leading-relaxed font-medium">
              Kiến thức được biên soạn dựa trên Giáo trình Kinh tế Chính trị Mác-Lênin.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em] text-slate-700 uppercase">
              <span></span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Chương 04</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span></span>
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
