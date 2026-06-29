import React from 'react';
import { motion } from 'framer-motion';
import { Factory, Landmark, Send, Globe, Swords } from 'lucide-react';

const CHARACTERISTICS = [
  {
    id: 1,
    title: "Tổ chức Độc quyền",
    desc: "Tập trung sản xuất dẫn đến hình thành các liên minh khổng lồ: Cartel, Syndicate, Trust, Consortium. Các tổ chức này chi phối hoàn toàn quá trình sản xuất và tiêu thụ hàng hóa.",
    icon: <Factory className="w-8 h-8 text-accent-cyan" />,
    className: "md:col-span-2 md:row-span-1",
    glow: "bg-accent-cyan/20",
  },
  {
    id: 2,
    title: "Tư bản Tài chính",
    desc: "Sự thâm nhập lẫn nhau giữa tư bản ngân hàng và tư bản công nghiệp. Quyền lực kinh tế tập trung vào tay một nhóm nhỏ được gọi là đầu sỏ tài chính, chi phối toàn bộ đời sống xã hội.",
    icon: <Landmark className="w-8 h-8 text-accent-violet" />,
    className: "md:col-span-1 md:row-span-2",
    glow: "bg-accent-violet/20",
  },
  {
    id: 3,
    title: "Xuất khẩu Tư bản",
    desc: "Thay vì chỉ xuất khẩu hàng hóa, các nước đế quốc đưa tư bản ra nước ngoài để khai thác nguồn tài nguyên và nhân công rẻ mạt, tối đa hóa giá trị thặng dư.",
    icon: <Send className="w-8 h-8 text-accent-orange" />,
    className: "md:col-span-1 md:row-span-1",
    glow: "bg-accent-orange/20",
  },
  {
    id: 4,
    title: "Phân chia Kinh tế Thế giới",
    desc: "Các liên minh độc quyền quốc tế thỏa thuận phân chia thị trường thế giới, thiết lập các khu vực ảnh hưởng kinh tế riêng biệt.",
    icon: <Globe className="w-8 h-8 text-accent-cyan" />,
    className: "md:col-span-1 md:row-span-1",
    glow: "bg-accent-cyan/20",
  },
  {
    id: 5,
    title: "Phân chia Lãnh thổ Thế giới",
    desc: "Các cường quốc đế quốc hoàn tất việc phân chia lãnh thổ thế giới, biến các khu vực kém phát triển thành thuộc địa hoặc vùng ảnh hưởng.",
    icon: <Swords className="w-8 h-8 text-accent-red" />,
    className: "md:col-span-1 md:row-span-1",
    glow: "bg-accent-red/20",
  }
];

export default function BentoGrid() {
  return (
    <section className="py-32 px-6 md:px-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="text-center mb-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent-cyan font-bold tracking-widest uppercase text-[10px] mb-6">
          <span className="w-1 h-1 rounded-full bg-accent-cyan" />
          Section 4.2: Đặc điểm kinh tế
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
          5 Đặc Điểm Kinh Tế<br /><span className="text-gradient-white">Của Độc Quyền</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          V.I. Lênin đã chỉ ra những biến đổi cốt lõi trong cấu trúc của CNTB khi chuyển mình sang giai đoạn đế quốc chủ nghĩa.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {CHARACTERISTICS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className={`group glass-card p-10 relative overflow-hidden flex flex-col justify-between ${item.className} glass-card-hover border-white/5 hover:border-white/20`}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full transition-opacity opacity-0 group-hover:opacity-40 pointer-events-none ${item.glow}`} />
            
            <div className="relative z-10">
              <div className="mb-10 p-5 bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/5">
                {item.icon}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-5 text-white group-hover:text-accent-cyan transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase group-hover:text-slate-300 transition-colors">
              <div className="w-8 h-[1px] bg-slate-800 group-hover:bg-accent-cyan transition-colors" />
              Lenin Detail 0{item.id}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
