import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

export default function Evolution() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative min-h-[400vh]">
      <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center px-6 md:px-24 py-12 gap-12 overflow-hidden">
        
        {/* Left Content (Sticky) */}
        <div className="w-full md:w-2/5 z-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-accent-cyan font-bold text-sm tracking-widest uppercase mb-4">4.1 Quá trình chuyển hóa</div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1]">
              Sự Tiến Hoá<br />Của Cạnh Tranh
            </h2>
            <p className="text-slate-400 text-lg max-w-sm mb-12 leading-relaxed">
              Dưới tác động của quy luật tích tụ và tập trung sản xuất, CNTB tự do cạnh tranh tất yếu chuyển sang giai đoạn độc quyền.
            </p>
            
            {/* Custom vertical progress indicator */}
            <div className="flex items-center gap-6">
              <div className="relative w-[2px] h-32 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  style={{ scaleY: scrollYProgress, originY: 0 }}
                  className="absolute inset-0 bg-gradient-to-b from-accent-cyan to-accent-violet" 
                />
              </div>
              <div className="flex flex-col gap-8">
                {STAGES.map((_, i) => (
                   <motion.span 
                    key={i}
                    style={{ 
                      opacity: useTransform(scrollYProgress, [i/STAGES.length, (i+0.5)/STAGES.length], [0.3, 1]),
                      scale: useTransform(scrollYProgress, [i/STAGES.length, (i+0.5)/STAGES.length], [0.8, 1.1])
                    }}
                    className="text-xs font-bold font-mono text-white/50"
                   >
                    0{i+1}
                   </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Cards Area */}
        <div className="w-full md:w-3/5 h-full flex flex-col items-center justify-center relative">
          {STAGES.map((stage, index) => (
            <EvolutionCard 
              key={index} 
              stage={stage} 
              index={index} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
      
      {/* Background Decorative Mesh */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[60%] bg-accent-violet/5 blur-[150px] pointer-events-none" />
    </section>
  );
}

function EvolutionCard({ stage, index, scrollYProgress }) {
  const step = 1 / STAGES.length;
  const start = index * step;
  const end = (index + 1) * step;
  
  // Refined transitions for smoother feel
  const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [start, start + 0.5, end], [80, 0, -80]);

  return (
    <motion.div
      style={{ opacity, scale, y, zIndex: STAGES.length - index }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-[opacity,transform]"
    >
      <div className="glass-card p-8 md:p-12 w-full max-w-xl relative overflow-hidden group pointer-events-auto">
        {/* Glow localized inside the card */}
        <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] -z-10 opacity-20 ${stage.accent}`} />
        
        <div className="relative z-10">
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">{stage.title}</h3>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            {stage.desc}
          </p>
          
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 transition-colors duration-500">
            <img 
              src={stage.image} 
              alt={stage.title} 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105 will-change-transform" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nightfall-950/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
