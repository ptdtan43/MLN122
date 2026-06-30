import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  {
    title: "Tự do Cạnh tranh",
    desc: "Giai đoạn đầu của CNTB, nơi hàng triệu doanh nghiệp nhỏ cạnh tranh khổng lồ để tồn tại. Quy luật giá trị hoạt động một cách tự phát, thúc đẩy cải tiến kỹ thuật nhưng cũng dẫn đến sự phân hóa.",
    image: "https://images.unsplash.com/photo-1546497974-b213c9efb599?crop=entropy&cs=srgb&fm=jpg&q=85",
    accent: "bg-sky-500",
  },
  {
    title: "Tích tụ & Tập trung",
    desc: "Cạnh tranh tất yếu dẫn đến tích tụ sản xuất. Các doanh nghiệp lớn hơn xuất hiện, thâu tóm nguồn lực và thị trường, làm biến đổi bản chất của sự cạnh tranh truyền thống.",
    image: "https://images.pexels.com/photos/9242927/pexels-photo-9242927.jpeg",
    accent: "bg-cyan-500",
  },
  {
    title: "Chủ nghĩa Độc quyền",
    desc: "Sự thống trị của một nhóm nhỏ các tổ chức khổng lồ. Độc quyền không thủ tiêu cạnh tranh mà làm nó trở nên gay gắt và tàn khốc hơn bao giờ hết.",
    image: "https://images.unsplash.com/photo-1552821773-37cbce3a7965?crop=entropy&cs=srgb&fm=jpg&q=85",
    accent: "bg-violet-600",
  }
];

const AUTO_INTERVAL = 5000;

export default function Evolution() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const go = (i) => { setDir(i > active ? 1 : -1); setActive(i); };

  // Auto-play timer
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setDir(1);
      setActive(prev => (prev + 1) % STAGES.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(timer.current);
  }, [paused]);

  const prevSlide = () => {
    setDir(-1);
    setActive(prev => (prev === 0 ? STAGES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDir(1);
    setActive(prev => (prev + 1) % STAGES.length);
  };

  const stage = STAGES[active];

  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[60%] bg-accent-violet/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-14"
        >
          <span className="text-accent-cyan font-bold text-[11px] md:text-xs tracking-[0.2em] uppercase">
            4.1 Quá trình chuyển hóa
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mt-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Sự Tiến Hoá<br />Của Cạnh Tranh
            </h2>
            <p className="text-slate-400 text-sm md:text-[15px] max-w-md leading-relaxed md:text-right">
              Dưới tác động của quy luật tích tụ và tập trung sản xuất, CNTB tự do cạnh tranh tất yếu chuyển sang giai đoạn độc quyền.
            </p>
          </div>
        </motion.div>

        {/* ── Slideshow ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tab bar — luôn ngang, hiển thị giống nhau trên mọi breakpoint */}
          <div className="flex gap-2 mb-6">
            {STAGES.map((s, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`
                  relative flex-1 py-3 px-3 md:px-4 rounded-xl border text-left
                  transition-all duration-300 overflow-hidden
                  ${i === active
                    ? 'bg-white/[0.06] border-white/15'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'}
                `}
              >
                {/* Progress bar */}
                {i === active && (
                  <motion.div
                    key={`bar-${active}`}
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-cyan to-accent-violet"
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? undefined : '100%' }}
                    transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                  />
                )}

                <span className={`
                  block text-[10px] font-black tracking-widest uppercase
                  transition-colors duration-300
                  ${i === active ? 'text-accent-cyan' : 'text-slate-600'}
                `}>
                  0{i + 1}
                </span>
                <span className={`
                  block text-xs sm:text-sm font-bold mt-0.5 truncate
                  transition-colors duration-300
                  ${i === active ? 'text-white' : 'text-slate-500'}
                `}>
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Card — chiều cao linh hoạt hơn để tránh đè chữ */}
          <div className="relative h-[460px] sm:h-[480px] md:h-[480px] group/slider">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                initial={(d) => ({ x: d > 0 ? 60 : -60, opacity: 0 })}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
                exit={(d) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } })}
                className="absolute inset-0"
              >
                <div className="glass-card h-full overflow-hidden group">
                  <div className="flex flex-col md:flex-row h-full">

                    {/* Image bên trái (desktop) / trên (mobile) */}
                    <div className="relative h-[180px] md:h-full md:w-[45%] shrink-0 overflow-hidden">
                      <img
                        src={stage.image}
                        alt={stage.title}
                        className="absolute inset-0 w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-[1.5s] ease-out will-change-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-nightfall-950/60 hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-nightfall-950/70 to-transparent md:hidden" />
                    </div>

                    {/* Nội dung bên phải */}
                    <div className="flex-1 flex flex-col justify-center p-5 sm:p-7 md:p-10 relative">
                      {/* Glow */}
                      <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-15 pointer-events-none ${stage.accent}`} />

                      <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase mb-4">
                          <span className={`w-1.5 h-1.5 rounded-full ${stage.accent}`} />
                          <span className="text-slate-400">Giai đoạn 0{active + 1} / 03</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 md:mb-4">
                          {stage.title}
                        </h3>

                        {/* Desc */}
                        <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left Button */}
            <button
              onClick={() => { setPaused(true); prevSlide(); }}
              aria-label="Previous"
              className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center border border-white/15 opacity-100 md:opacity-0 group-hover/slider:opacity-100 transition-all z-20 backdrop-blur-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            {/* Right Button */}
            <button
              onClick={() => { setPaused(true); nextSlide(); }}
              aria-label="Next"
              className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center border border-white/15 opacity-100 md:opacity-0 group-hover/slider:opacity-100 transition-all z-20 backdrop-blur-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2.5 mt-6 md:mt-8">
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Giai đoạn ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-8 h-2.5 bg-accent-cyan' : 'w-2.5 h-2.5 bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
