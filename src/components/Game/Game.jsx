import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/*
  GAME: "ĐẠI CHIẾN ĐỘC QUYỀN" (Gacha rút thẻ + Đánh Boss 3 GIAI ĐOẠN)
  Bám sát Giáo trình KTCT Mác-Lênin (2021):
    - 4.1: Cạnh tranh ở cấp độ độc quyền (tự do cạnh tranh -> tích tụ, tập trung -> độc quyền)
    - 4.2: 5 đặc điểm kinh tế của độc quyền theo V.I.Lênin
  Trận đấu kéo dài qua 3 PHASE ứng với 3 nấc phát triển của độc quyền:
    Phase 1: Tổ chức Độc quyền  -> Phase 2: Tư bản Tài chính -> Phase 3: Độc quyền Nhà nước.
*/

// ====== KHO THẺ BÀI (đúng nội dung 4.1 & 4.2) ======
const CARD_POOL = [
    {
        id: 1, name: 'Tự do Cạnh tranh', tag: '4.1', type: 'attack', value: 95,
        desc: 'Cạnh tranh giữa tổ chức độc quyền với DN ngoài độc quyền.',
        know: 'Độc quyền không thủ tiêu cạnh tranh mà làm nó gay gắt hơn: độc quyền vs ngoài độc quyền, giữa các tổ chức độc quyền, và nội bộ tổ chức độc quyền.',
        color: 'from-sky-500 to-blue-600',
    },
    {
        id: 2, name: 'Tích tụ & Tập trung SX', tag: '4.1', type: 'buff', value: 65,
        desc: 'Phơi bày nguồn gốc của độc quyền, vô hiệu lá chắn Boss.',
        know: 'Độc quyền sinh ra từ tự do cạnh tranh: cạnh tranh -> tích tụ & tập trung sản xuất tới mức cao -> hình thành tổ chức độc quyền (Lênin).',
        color: 'from-cyan-500 to-teal-600',
    },
    {
        id: 3, name: 'ĐĐ1: Tổ chức Độc quyền', tag: '4.2', type: 'attack', value: 115,
        desc: 'Vạch trần Cartel – Syndicate – Trust – Consortium.',
        know: 'ĐĐ1: Tập trung sản xuất và các tổ chức độc quyền. Hình thức: Cartel, Syndicate, Trust, Consortium (tích tụ ngày càng cao).',
        color: 'from-amber-500 to-orange-600',
    },
    {
        id: 4, name: 'ĐĐ2: Tư bản Tài chính', tag: '4.2', type: 'attack', value: 125,
        desc: 'Bóc trần bọn đầu sỏ tài chính chi phối kinh tế.',
        know: 'ĐĐ2: Tư bản tài chính = hợp nhất tư bản độc quyền ngân hàng với công nghiệp, sinh ra bọn đầu sỏ tài chính thống trị.',
        color: 'from-yellow-500 to-amber-600',
    },
    {
        id: 5, name: 'ĐĐ3: Xuất khẩu Tư bản', tag: '4.2', type: 'attack', value: 115,
        desc: 'Chặn dòng xuất khẩu tư bản đi bóc lột nước khác.',
        know: 'ĐĐ3: Xuất khẩu tư bản (đầu tư ra nước ngoài) trở thành phổ biến, khác xuất khẩu hàng hóa thời tự do cạnh tranh.',
        color: 'from-orange-500 to-red-500',
    },
    {
        id: 6, name: 'ĐĐ4: Phân chia Kinh tế', tag: '4.2', type: 'attack', value: 110,
        desc: 'Phá thế phân chia thị trường giữa các tập đoàn.',
        know: 'ĐĐ4: Phân chia thế giới về kinh tế giữa các tổ chức độc quyền (liên minh độc quyền quốc tế thỏa thuận chia thị trường).',
        color: 'from-rose-500 to-pink-600',
    },
    {
        id: 7, name: 'ĐĐ5: Phân chia Lãnh thổ', tag: '4.2', type: 'attack', value: 110,
        desc: 'Vạch trần cuộc chia lại thuộc địa giữa các cường quốc.',
        know: 'ĐĐ5: Phân chia thế giới về lãnh thổ giữa các cường quốc – nguồn gốc kinh tế của chiến tranh đế quốc.',
        color: 'from-fuchsia-500 to-purple-600',
    },
    {
        id: 8, name: 'Khủng hoảng Thừa', tag: 'GAME', type: 'heal', value: 130,
        desc: 'Mâu thuẫn nội tại của CNTB độc quyền – hồi 130 HP.',
        know: 'Độc quyền không xóa bỏ mâu thuẫn của CNTB; khủng hoảng kinh tế vẫn nổ ra, làm suy yếu thế lực độc quyền.',
        color: 'from-emerald-500 to-green-600',
    },
    {
        id: 9, name: 'Vai trò Lịch sử của CNTB', tag: 'GAME', type: 'heal', value: 90,
        desc: 'Quy luật khách quan – hồi 90 HP & tiếp thêm sĩ khí.',
        know: 'CNTB tạo tiền đề vật chất – kỹ thuật cho xã hội mới, nhưng tất yếu bị thay thế do mâu thuẫn nội tại không thể khắc phục.',
        color: 'from-teal-500 to-emerald-600',
    },
];

// ====== 3 GIAI ĐOẠN CỦA BOSS ======
const PHASES = [
    {
        name: 'GĐ1 · TỔ CHỨC ĐỘC QUYỀN', image: '/boss_1.png', maxHP: 600,
        accumStep: 10, dmgMin: 30, dmgMax: 50, burst: 120,
        barFrom: 'from-purple-500', barTo: 'to-fuchsia-500',
        intro: 'Boss tích tụ & tập trung sản xuất, hình thành tổ chức độc quyền.',
    },
    {
        name: 'GĐ2 · TƯ BẢN TÀI CHÍNH', image: '/boss_2.png', maxHP: 800,
        accumStep: 13, dmgMin: 40, dmgMax: 60, burst: 180,
        barFrom: 'from-amber-500', barTo: 'to-red-500',
        intro: 'Bọn đầu sỏ tài chính nhập cuộc — Boss mạnh & hung hãn hơn.',
    },
    {
        name: 'GĐ3 · ĐỘC QUYỀN NHÀ NƯỚC', image: '/boss_3.png', maxHP: 1000,
        accumStep: 16, dmgMin: 50, dmgMax: 70, burst: 250,
        barFrom: 'from-rose-600', barTo: 'to-purple-700',
        intro: 'Độc quyền nhà nước — kết hợp sức mạnh độc quyền tư nhân với nhà nước.',
    },
];

const PLAYER_MAX = 600;

export default function Game() {
    const [gameState, setGameState] = useState('LOBBY'); // LOBBY, PLAYING, WON, LOST
    const [teamName, setTeamName] = useState('');
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [bossHP, setBossHP] = useState(PHASES[0].maxHP);
    const [playerHP, setPlayerHP] = useState(PLAYER_MAX);
    const [accum, setAccum] = useState(0);
    const [turnCount, setTurnCount] = useState(0);
    const [hand, setHand] = useState([]);
    const [log, setLog] = useState([]);
    const [shake, setShake] = useState(false);
    const [flash, setFlash] = useState(false);
    const [tip, setTip] = useState(null);
    const [banner, setBanner] = useState(null);
    const logRef = useRef(null);

    const phase = PHASES[phaseIdx];

    const startGame = (e) => {
        e.preventDefault();
        if (!teamName.trim()) return;
        setGameState('PLAYING');
        drawCards(4, true);
        setLog([{ id: Math.random(), text: `Trận đấu bắt đầu! Nhóm [${teamName}] khai chiến — ${PHASES[0].name} (${PHASES[0].maxHP} HP).` }]);
    };

    const drawCards = (count, reset = false) => {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const c = CARD_POOL[Math.floor(Math.random() * CARD_POOL.length)];
            cards.push({ ...c, instanceId: `${Date.now()}-${Math.random()}` });
        }
        setHand((prev) => (reset ? cards : [...prev, ...cards]).slice(0, 5));
    };

    const pushTip = (card) => {
        setTip({ name: card.name, know: card.know, tag: card.tag });
        setTimeout(() => setTip(null), 4200);
    };

    const showBanner = (text) => {
        setBanner(text);
        setTimeout(() => setBanner(null), 2600);
    };

    const playCard = (card) => {
        if (gameState !== 'PLAYING') return;
        pushTip(card);

        let newBossHP = bossHP;
        let newPlayerHP = playerHP;
        let newAccum = accum;
        const lines = [];

        // ----- Hành động người chơi -----
        let isWrongTag = (phaseIdx === 0 && card.tag !== '4.1') || (phaseIdx > 0 && card.tag !== '4.2');

        if (card.type === 'attack') {
            let baseDmg = card.value;
            let logMsg = `⚔️ [${card.name}]`;

            if (isWrongTag) {
                baseDmg = Math.round(baseDmg / 2);
                logMsg += ` (Sai hệ -50%)`;
            }

            if (accum >= 60) {
                baseDmg = Math.round(baseDmg * 1.5);
                logMsg += ` (Sơ hở CHÍ MẠNG x1.5!)`;
            }

            newBossHP = Math.max(0, bossHP - baseDmg);
            newAccum = Math.max(0, accum - 25);
            lines.push(`${logMsg} gây ${baseDmg} sát thương.`);
            setShake(true); setTimeout(() => setShake(false), 320);
        } else if (card.type === 'buff') {
            let baseDmg = card.value;
            let logMsg = `✨ [${card.name}]`;
            
            if (isWrongTag) {
                baseDmg = Math.round(baseDmg / 2);
                logMsg += ` (Sai hệ -50%)`;
            }

            newBossHP = Math.max(0, bossHP - baseDmg);
            newAccum = Math.max(0, accum - 40);
            lines.push(`${logMsg} đánh vỡ ${baseDmg} HP.`);
            setShake(true); setTimeout(() => setShake(false), 320);
        } else if (card.type === 'heal') {
            newPlayerHP = Math.min(PLAYER_MAX, playerHP + card.value);
            lines.push(`💖 [${card.name}] hồi ${card.value} HP.`);
        }

        setHand((prev) => prev.filter((c) => c.instanceId !== card.instanceId));

        // ----- Boss của phase hiện tại bị hạ -> chuyển phase / thắng -----
        if (newBossHP <= 0) {
            if (phaseIdx < PHASES.length - 1) {
                const nextIdx = phaseIdx + 1;
                const np = PHASES[nextIdx];
                const healed = Math.min(PLAYER_MAX, newPlayerHP + 80); // thưởng hồi máu khi qua phase
                lines.push(`🔥 Hạ gục ${phase.name}! Tiến hóa thành ${np.name} (+thưởng 80 HP).`);
                showBanner(np.name);
                setPhaseIdx(nextIdx);
                setBossHP(np.maxHP);
                setPlayerHP(healed);
                setAccum(0);
                setTurnCount((p) => p + 1);
                const logObjs = lines.reverse().map(l => ({ id: Math.random(), text: l }));
                setLog((prev) => [...logObjs, ...prev]);
                drawCards(1);
                return;
            } else {
                setBossHP(0);
                setGameState('WON');
                const winMsg = `🎉 Nhóm ${teamName} đã đánh bại cả 3 giai đoạn độc quyền sau ${turnCount + 1} lượt!`;
                setLog((prev) => [{ id: Math.random(), text: winMsg }, { id: Math.random(), text: lines[0] }, ...prev]);
                return;
            }
        }

        // ----- Lượt Boss: tích tụ tư bản -----
        newAccum = Math.min(100, newAccum + phase.accumStep);
        let bossDamage = Math.floor(Math.random() * (phase.dmgMax - phase.dmgMin + 1)) + phase.dmgMin;
        if (newAccum >= 100) {
            bossDamage += phase.burst;
            newAccum = 0;
            newBossHP = Math.min(phase.maxHP, newBossHP + 40);
            lines.push(`😈 TÍCH TỤ TỐI ĐA! Boss bành trướng: gây ${bossDamage} sát thương & hồi 40 HP.`);
        } else {
            lines.push(`😈 Boss phản công ${bossDamage} sát thương (tích tụ +${phase.accumStep}%).`);
        }
        newPlayerHP = Math.max(0, newPlayerHP - bossDamage);
        setFlash(true); setTimeout(() => setFlash(false), 260);

        if (newPlayerHP <= 0) {
            setPlayerHP(0);
            setGameState('LOST');
            const lostMsg = `💀 Phe ta bị thôn tính ở ${phase.name}. Ôn lại 4.1–4.2 và thử lại!`;
            const logObjs = lines.reverse().map(l => ({ id: Math.random(), text: l }));
            setLog((prev) => [{ id: Math.random(), text: lostMsg }, ...logObjs, ...prev]);
            return;
        }

        setBossHP(newBossHP);
        setPlayerHP(newPlayerHP);
        setAccum(newAccum);
        setTurnCount((p) => p + 1);
        const logObjs = lines.reverse().map(l => ({ id: Math.random(), text: l }));
        setLog((prev) => [...logObjs, ...prev]);
        drawCards(1);
    };

    const resetGame = () => {
        setPhaseIdx(0); setBossHP(PHASES[0].maxHP); setPlayerHP(PLAYER_MAX);
        setAccum(0); setTurnCount(0); setHand([]); setLog([]); setTip(null); setBanner(null);
        setGameState('LOBBY');
    };

    const Bar = ({ val, max, from, to }) => (
        <div className="w-full bg-slate-700/70 h-3 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${from} ${to} transition-all duration-500 ease-out`}
                style={{ width: `${(val / max) * 100}%` }} />
        </div>
    );

    return (
        <div className={`w-full ${gameState === 'PLAYING' ? 'max-w-5xl' : 'max-w-lg'} mx-auto relative transition-all duration-500`}>
            
            {/* Tooltip & Banner (Global overlays) */}
            {banner && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-3xl animate-[fadeIn_.2s_ease]">
                    <div className="text-center px-6">
                        <div className="text-xs text-slate-300 tracking-widest mb-1">⚠️ ĐỘC QUYỀN TIẾN HÓA</div>
                        <div className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{banner}</div>
                    </div>
                </div>
            )}
            {/* Floating Battle Log (Toast) - Using Portal to escape CSS transform limits */}
            {typeof document !== 'undefined' && createPortal(
                <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
                    <AnimatePresence>
                        {log.slice(0, 4).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1 - idx * 0.15, x: 0, scale: 1 - idx * 0.05 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                layout
                                className={`w-64 sm:w-80 bg-slate-900/95 shadow-2xl p-3 rounded-xl text-[11px] font-mono pointer-events-auto border ${
                                    idx === 0 ? 'border-yellow-500/50 text-yellow-400 font-bold' : 'border-slate-700/50 text-slate-300'
                                }`}
                                style={{ zIndex: 50 - idx }}
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}

            {tip && typeof document !== 'undefined' && createPortal(
                <div className="fixed top-8 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-[9999] bg-slate-900/95 border border-yellow-500/40 rounded-xl p-3 shadow-2xl animate-[fadeIn_.2s_ease]">
                    <div className="text-[10px] font-bold text-yellow-400 tracking-widest mb-1">📘 [{tip.tag}] · {tip.name}</div>
                    <div className="text-[11px] text-slate-300 leading-relaxed font-mono">{tip.know}</div>
                </div>,
                document.body
            )}

            {/* ===== LOBBY ===== */}
            {gameState === 'LOBBY' && (
                <div className="bg-slate-800/90 backdrop-blur rounded-3xl p-6 shadow-2xl border border-slate-700 text-center space-y-5 relative overflow-hidden">
                    <img src="/boss_3.png" alt="Monopoly Boss" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-cover rounded-full border-4 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse" />
                    <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent uppercase tracking-wider">Đại Chiến Độc Quyền</h1>
                    <p className="text-xs text-slate-400">Chương 4 · 4.1 Cạnh tranh ở cấp độ độc quyền & 4.2 Đặc điểm kinh tế của độc quyền (Lênin)</p>
                    <div className="bg-slate-700/40 p-3 sm:p-4 rounded-xl text-left text-[11px] space-y-1.5 text-slate-300">
                        <p className="font-bold text-yellow-400">⚔️ LUẬT CHƠI MỚI:</p>
                        <p>• <strong>KHẮC HỆ:</strong> GĐ1 yếu với thẻ <strong>[4.1]</strong>. GĐ2 & GĐ3 yếu với thẻ <strong>[4.2]</strong>. Đánh sai hệ bị <strong>giảm 50% sát thương</strong>.</p>
                        <p>• <strong>SƠ HỞ:</strong> Khi Tích tụ ≥ 60%, Boss mất cảnh giác, đánh sẽ <strong>chí mạng x1.5 sát thương</strong>.</p>
                        <p>• <strong>BÀNH TRƯỚNG:</strong> Đừng để Boss tích tụ đến 100%, đòn giáng xuống sẽ cực kỳ thảm khốc!</p>
                    </div>
                    <form onSubmit={startGame} className="space-y-3 relative z-10">
                        <input type="text" placeholder="Nhập tên Nhóm..."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl focus:outline-none focus:border-red-500 text-center font-bold text-white text-sm"
                            value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                        <button type="submit" className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 font-bold rounded-xl transition shadow-lg shadow-red-600/30 text-white text-sm sm:text-base">
                            VÀO TRẬN
                        </button>
                    </form>
                </div>
            )}

            {/* ===== PLAYING ===== */}
            {gameState === 'PLAYING' && (
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* KHU VỰC BOSS (TRÁI) */}
                    <div className="w-full md:w-5/12 lg:w-1/2 flex flex-col gap-4">
                        {/* Boss Visual Avatar */}
                        <div className={`flex-1 min-h-[250px] bg-slate-900/90 backdrop-blur rounded-3xl border border-purple-500/30 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-2xl ${shake ? 'animate-[shake_.3s]' : ''}`}>
                            {/* Background Glow */}
                            <div className={`absolute inset-0 opacity-20 blur-3xl bg-gradient-to-br ${phase.barFrom} to-transparent pointer-events-none`} />
                            
                            <img src={phase.image} alt={phase.name} className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border-4 border-slate-700/50 mb-4 relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-[bounce_4s_ease-in-out_infinite]" />
                            
                            <div className="text-center font-black text-xl md:text-2xl text-white mb-2 uppercase relative z-10 tracking-widest">{phase.name}</div>
                            <div className="text-center text-[11px] md:text-xs text-slate-400 max-w-sm relative z-10 leading-relaxed">{phase.intro}</div>
                        </div>

                        {/* Boss HP Bar */}
                        <div className={`bg-slate-900/90 p-4 md:p-5 rounded-3xl border border-slate-700 shadow-xl space-y-3 ${shake ? 'animate-[shake_.3s]' : ''}`}>
                            <div className="text-sm font-bold text-purple-200 flex justify-between uppercase tracking-wider">
                                <span>Máu Boss</span><span className="font-mono">{bossHP}/{phase.maxHP}</span>
                            </div>
                            <Bar val={bossHP} max={phase.maxHP} from={phase.barFrom} to={phase.barTo} />
                            
                            <div className="flex justify-between text-[10px] md:text-xs pt-2 font-bold uppercase tracking-wider transition-colors duration-300">
                                <span className={accum < 60 ? 'text-slate-400' : 'text-amber-400'}>{accum < 60 ? '⚡ TÍCH TỤ TƯ BẢN' : '⚠️ SƠ HỞ! CHÍ MẠNG x1.5'}</span>
                                <span className="text-amber-400">{accum}%</span>
                            </div>
                            <Bar val={accum} max={100} from={accum < 60 ? 'from-slate-600' : 'from-amber-400'} to={accum < 60 ? 'to-slate-400' : 'to-red-500'} />
                        </div>
                    </div>

                    {/* KHU VỰC NGƯỜI CHƠI (PHẢI) */}
                    <div className={`w-full md:w-7/12 lg:w-1/2 flex flex-col gap-4 bg-slate-800/95 backdrop-blur rounded-3xl p-4 sm:p-5 border shadow-2xl transition-colors duration-300 ${flash ? 'bg-red-900/50 border-red-500' : 'border-slate-700'}`}>
                        {/* Header Player */}
                        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-700/50 pb-3">
                            <span>Nhóm: <strong className="text-white text-sm">{teamName}</strong></span>
                            <span>Lượt: <strong className="text-yellow-400 text-sm">{turnCount}</strong></span>
                        </div>

                        {/* Progress */}
                        <div className="flex gap-1.5">
                            {PHASES.map((p, i) => (
                                <div key={i} className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg font-bold transition uppercase tracking-wider ${
                                    i < phaseIdx ? 'bg-green-600/40 text-green-300'
                                    : i === phaseIdx ? 'bg-purple-600/60 text-white'
                                    : 'bg-slate-700/40 text-slate-500'
                                }`}>
                                    <img src={p.image} className={`w-5 h-5 rounded-full object-cover ${i > phaseIdx ? 'opacity-40 grayscale' : ''}`} alt={p.name} />
                                    <span className="text-[9px]">GĐ{i + 1}{i < phaseIdx ? ' ✓' : ''}</span>
                                </div>
                            ))}
                        </div>

                        {/* Player HP */}
                        <div className="bg-slate-900/70 p-4 rounded-xl border border-green-500/20 space-y-2">
                            <div className="text-sm font-bold text-green-300 flex justify-between uppercase tracking-wider">
                                <span>✊ Lực lượng tiến bộ</span><span className="font-mono text-white">{playerHP}/{PLAYER_MAX}</span>
                            </div>
                            <Bar val={playerHP} max={PLAYER_MAX} from="from-green-500" to="to-emerald-400" />
                        </div>

                        {/* Hand Cards */}
                        <div className="space-y-2 flex-1">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vũ khí lý luận (Chọn 1)</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {hand.map((card) => (
                                    <button key={card.instanceId} onClick={() => playCard(card)}
                                        className={`w-full text-left p-3 rounded-xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-between bg-gradient-to-r ${card.color} text-white shadow-md min-h-[60px]`}>
                                        <div className="pr-2 flex-1">
                                            <div className="font-bold text-sm flex items-center gap-1.5 flex-wrap">
                                                <span className="bg-black/30 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">{card.tag}</span>
                                                <span>{card.name}</span>
                                            </div>
                                            <div className="text-[10px] opacity-90 font-light mt-0.5 leading-relaxed">{card.desc}</div>
                                        </div>
                                        <span className="bg-black/25 text-xs px-2 py-1.5 rounded-lg font-mono font-bold shrink-0 ml-2">
                                            {card.type === 'heal' ? `+${card.value}` : `-${card.value}`}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== WON ===== */}
            {gameState === 'WON' && (
                <div className="bg-slate-800/90 backdrop-blur rounded-3xl p-6 shadow-2xl border border-slate-700 text-center space-y-5 py-8 relative overflow-hidden">
                    <div className="text-6xl">🏆</div>
                    <h2 className="text-3xl font-black text-green-400 uppercase tracking-widest">Chiến thắng!</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Nhóm <strong className="text-yellow-400 text-base">{teamName}</strong> đã hạ cả 3 giai đoạn độc quyền bằng vũ khí lý luận 4.1 & 4.2!
                    </p>
                    <div className="bg-slate-900 p-5 rounded-2xl border border-green-500/30">
                        <div className="text-xs text-slate-400 tracking-widest font-bold">SỐ LƯỢT ĐÃ DÙNG</div>
                        <div className="text-5xl font-black text-yellow-400 mt-2">{turnCount} Lượt</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-3 tracking-widest">MÃ XÁC THỰC: VICTORY_MAC_LENIN_2026</div>
                    </div>
                    <div className="bg-slate-700/40 p-4 rounded-2xl text-left text-[11px] text-slate-300 space-y-1.5">
                        <p className="font-bold text-yellow-400 text-xs mb-2 uppercase tracking-widest">📘 Tóm tắt 5 đặc điểm độc quyền:</p>
                        <p>1. Tổ chức độc quyền (Cartel, Syndicate, Trust, Consortium)</p>
                        <p>2. Tư bản tài chính & đầu sỏ tài chính</p>
                        <p>3. Xuất khẩu tư bản</p>
                        <p>4. Phân chia thế giới về kinh tế</p>
                        <p>5. Phân chia thế giới về lãnh thổ</p>
                    </div>
                    <button onClick={resetGame} className="w-full py-4 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl text-sm text-white tracking-widest uppercase transition-colors">CHƠI LẠI</button>
                </div>
            )}

            {/* ===== LOST ===== */}
            {gameState === 'LOST' && (
                <div className="text-center space-y-5 py-2">
                    <div className="text-6xl">💀</div>
                    <h2 className="text-2xl font-black text-red-500 uppercase">Thất bại</h2>
                    <p className="text-sm text-slate-300">Bạn đã trụ tới <strong className="text-purple-300">{phase.name}</strong>. Hãy ôn lại 4.1 & 4.2 rồi phản công!</p>
                    <button onClick={resetGame} className="w-full py-3 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl transition text-white min-h-[48px]">THỬ LẠI</button>
                </div>
            )}

            <style>{`
                @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
                @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
            `}</style>
        </div>
    );
}
