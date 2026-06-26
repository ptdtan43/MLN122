import React, { useState, useEffect, useRef } from 'react';

/*
  GAME: "ĐẠI CHIẾN ĐỘC QUYỀN" (Gacha rút thẻ + Đánh Boss 3 GIAI ĐOẠN)
  Bám sát Giáo trình KTCT Mác-Lênin (2021):
    - 4.1: Cạnh tranh ở cấp độ độc quyền (tự do cạnh tranh -> tích tụ, tập trung -> độc quyền)
    - 4.2: 5 đặc điểm kinh tế của độc quyền theo V.I.Lênin
  Trận đấu kéo dài qua 3 PHASE ứng với 3 nấc phát triển của độc quyền:
    Phase 1: Tổ chức Độc quyền  -> Phase 2: Tư bản Tài chính -> Phase 3: Độc quyền Nhà nước.
  Mỗi phase Boss mạnh hơn, phản công khác nhau -> kéo dài & tăng chiến thuật.
*/

// ====== KHO THẺ BÀI (đúng nội dung 4.1 & 4.2) ======
const CARD_POOL = [
    // --- 4.1 ---
    {
        id: 1, name: 'Tự do Cạnh tranh', tag: '4.1', type: 'attack', value: 85,
        desc: 'Cạnh tranh giữa tổ chức độc quyền với DN ngoài độc quyền.',
        know: 'Độc quyền không thủ tiêu cạnh tranh mà làm nó gay gắt hơn: độc quyền vs ngoài độc quyền, giữa các tổ chức độc quyền, và nội bộ tổ chức độc quyền.',
        color: 'from-sky-500 to-blue-600',
    },
    {
        id: 2, name: 'Tích tụ & Tập trung SX', tag: '4.1', type: 'buff', value: 55,
        desc: 'Phơi bày nguồn gốc của độc quyền, vô hiệu lá chắn Boss.',
        know: 'Độc quyền sinh ra từ tự do cạnh tranh: cạnh tranh -> tích tụ & tập trung sản xuất tới mức cao -> hình thành tổ chức độc quyền (Lênin).',
        color: 'from-cyan-500 to-teal-600',
    },
    // --- 4.2: 5 đặc điểm ---
    {
        id: 3, name: 'ĐĐ1: Tổ chức Độc quyền', tag: '4.2', type: 'attack', value: 105,
        desc: 'Vạch trần Cartel – Syndicate – Trust – Consortium.',
        know: 'ĐĐ1: Tập trung sản xuất và các tổ chức độc quyền. Hình thức: Cartel, Syndicate, Trust, Consortium (tích tụ ngày càng cao).',
        color: 'from-amber-500 to-orange-600',
    },
    {
        id: 4, name: 'ĐĐ2: Tư bản Tài chính', tag: '4.2', type: 'attack', value: 115,
        desc: 'Bóc trần bọn đầu sỏ tài chính chi phối kinh tế.',
        know: 'ĐĐ2: Tư bản tài chính = hợp nhất tư bản độc quyền ngân hàng với công nghiệp, sinh ra bọn đầu sỏ tài chính thống trị.',
        color: 'from-yellow-500 to-amber-600',
    },
    {
        id: 5, name: 'ĐĐ3: Xuất khẩu Tư bản', tag: '4.2', type: 'attack', value: 105,
        desc: 'Chặn dòng xuất khẩu tư bản đi bóc lột nước khác.',
        know: 'ĐĐ3: Xuất khẩu tư bản (đầu tư ra nước ngoài) trở thành phổ biến, khác xuất khẩu hàng hóa thời tự do cạnh tranh.',
        color: 'from-orange-500 to-red-500',
    },
    {
        id: 6, name: 'ĐĐ4: Phân chia Kinh tế', tag: '4.2', type: 'attack', value: 100,
        desc: 'Phá thế phân chia thị trường giữa các tập đoàn.',
        know: 'ĐĐ4: Phân chia thế giới về kinh tế giữa các tổ chức độc quyền (liên minh độc quyền quốc tế thỏa thuận chia thị trường).',
        color: 'from-rose-500 to-pink-600',
    },
    {
        id: 7, name: 'ĐĐ5: Phân chia Lãnh thổ', tag: '4.2', type: 'attack', value: 100,
        desc: 'Vạch trần cuộc chia lại thuộc địa giữa các cường quốc.',
        know: 'ĐĐ5: Phân chia thế giới về lãnh thổ giữa các cường quốc – nguồn gốc kinh tế của chiến tranh đế quốc.',
        color: 'from-fuchsia-500 to-purple-600',
    },
    // --- Phòng thủ ---
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
        name: 'GĐ1 · TỔ CHỨC ĐỘC QUYỀN', emoji: '🏭', maxHP: 900,
        accumStep: 10, dmgMin: 30, dmgMax: 50, burst: 50,
        barFrom: 'from-purple-500', barTo: 'to-fuchsia-500',
        intro: 'Boss tích tụ & tập trung sản xuất, hình thành tổ chức độc quyền.',
    },
    {
        name: 'GĐ2 · TƯ BẢN TÀI CHÍNH', emoji: '🏦', maxHP: 1100,
        accumStep: 13, dmgMin: 40, dmgMax: 60, burst: 70,
        barFrom: 'from-amber-500', barTo: 'to-red-500',
        intro: 'Bọn đầu sỏ tài chính nhập cuộc — Boss mạnh & hung hãn hơn.',
    },
    {
        name: 'GĐ3 · ĐỘC QUYỀN NHÀ NƯỚC', emoji: '👑', maxHP: 1300,
        accumStep: 16, dmgMin: 50, dmgMax: 70, burst: 95,
        barFrom: 'from-rose-600', barTo: 'to-purple-700',
        intro: 'Độc quyền nhà nước — kết hợp sức mạnh độc quyền tư nhân với nhà nước.',
    },
];

const PLAYER_MAX = 600;

export default function App() {
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

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = 0; }, [log]);

    const startGame = (e) => {
        e.preventDefault();
        if (!teamName.trim()) return;
        setGameState('PLAYING');
        drawCards(4, true);
        setLog([`Trận đấu bắt đầu! Nhóm [${teamName}] khai chiến — ${PHASES[0].name} (${PHASES[0].maxHP} HP).`]);
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
        if (card.type === 'attack') {
            const crit = accum >= 60;
            const dmg = crit ? Math.round(card.value * 1.5) : card.value;
            newBossHP = Math.max(0, bossHP - dmg);
            newAccum = Math.max(0, accum - 25);
            lines.push(`⚔️ [${card.name}] gây ${dmg} sát thương${crit ? ' (CHÍ MẠNG!)' : ''}.`);
            setShake(true); setTimeout(() => setShake(false), 320);
        } else if (card.type === 'buff') {
            newBossHP = Math.max(0, bossHP - card.value);
            newAccum = Math.max(0, accum - 40);
            lines.push(`✨ [${card.name}] vô hiệu hóa lá chắn & gây ${card.value} sát thương.`);
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
                showBanner(`${np.emoji} ${np.name}`);
                setPhaseIdx(nextIdx);
                setBossHP(np.maxHP);
                setPlayerHP(healed);
                setAccum(0);
                setTurnCount((p) => p + 1);
                setLog((prev) => [...lines.reverse(), ...prev]);
                drawCards(1);
                return;
            } else {
                setBossHP(0);
                setGameState('WON');
                setLog((prev) => [`🎉 Nhóm ${teamName} đã đánh bại cả 3 giai đoạn độc quyền sau ${turnCount + 1} lượt!`, lines[0], ...prev]);
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
            setLog((prev) => [`💀 Phe ta bị thôn tính ở ${phase.name}. Ôn lại 4.1–4.2 và thử lại!`, ...lines.reverse(), ...prev]);
            return;
        }

        setBossHP(newBossHP);
        setPlayerHP(newPlayerHP);
        setAccum(newAccum);
        setTurnCount((p) => p + 1);
        setLog((prev) => [...lines.reverse(), ...prev]);
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
        <div className={`min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white font-sans antialiased p-4 flex flex-col items-center justify-center transition-colors ${flash ? 'bg-red-900/40' : ''}`}>
            <div className="w-full max-w-md bg-slate-800/90 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border border-slate-700 p-6 relative">

                {/* Banner chuyển phase */}
                {banner && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 rounded-3xl animate-[fadeIn_.2s_ease]">
                        <div className="text-center px-6">
                            <div className="text-xs text-slate-300 tracking-widest mb-1">⚠️ ĐỘC QUYỀN TIẾN HÓA</div>
                            <div className="text-2xl font-black bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">{banner}</div>
                        </div>
                    </div>
                )}

                {/* Tooltip kiến thức */}
                {tip && (
                    <div className="absolute top-3 left-3 right-3 z-20 bg-slate-900/95 border border-yellow-500/40 rounded-xl p-3 shadow-xl animate-[fadeIn_.2s_ease]">
                        <div className="text-[10px] font-bold text-yellow-400 tracking-widest mb-1">📘 [{tip.tag}] · {tip.name}</div>
                        <div className="text-[11px] text-slate-200 leading-relaxed">{tip.know}</div>
                    </div>
                )}

                {/* ===== LOBBY ===== */}
                {gameState === 'LOBBY' && (
                    <div className="text-center space-y-5">
                        <div className="text-5xl">🏭⚔️👑</div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent uppercase tracking-wider">Đại Chiến Độc Quyền</h1>
                        <p className="text-xs text-slate-400">Chương 4 · 4.1 Cạnh tranh ở cấp độ độc quyền & 4.2 Đặc điểm kinh tế của độc quyền (Lênin)</p>
                        <div className="bg-slate-700/40 p-4 rounded-xl text-left text-[11px] space-y-1.5 text-slate-300">
                            <p className="font-bold text-yellow-400">⚔️ LUẬT CHƠI:</p>
                            <p>• Boss có <strong>3 GIAI ĐOẠN</strong>: Tổ chức Độc quyền → Tư bản Tài chính → Độc quyền Nhà nước.</p>
                            <p>• Mỗi GĐ Boss mạnh hơn; hạ xong 1 GĐ được <strong>thưởng +80 HP</strong>.</p>
                            <p>• Boss <strong>tự tích tụ tư bản</strong> — đánh khi tích tụ ≥60% sẽ <strong>chí mạng x1.5</strong>.</p>
                            <p>• Mỗi thẻ hiện <strong>kiến thức 4.1/4.2</strong> hỗ trợ phản biện.</p>
                            <p>• Thi đua: hạ cả 3 GĐ với <strong>ít lượt nhất</strong> thắng!</p>
                        </div>
                        <form onSubmit={startGame} className="space-y-3">
                            <input type="text" placeholder="Nhập tên Nhóm..."
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl focus:outline-none focus:border-red-500 text-center font-bold"
                                value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 font-bold rounded-xl transition shadow-lg shadow-red-600/30">
                                VÀO TRẬN
                            </button>
                        </form>
                    </div>
                )}

                {/* ===== PLAYING ===== */}
                {gameState === 'PLAYING' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-700 pb-2">
                            <span>Nhóm: <strong className="text-white">{teamName}</strong></span>
                            <span>Lượt: <strong className="text-yellow-400">{turnCount}</strong></span>
                        </div>

                        {/* Chỉ báo tiến độ 3 phase */}
                        <div className="flex gap-1.5">
                            {PHASES.map((p, i) => (
                                <div key={i} className={`flex-1 text-center text-[9px] py-1 rounded-md font-bold transition ${i < phaseIdx ? 'bg-green-600/40 text-green-300'
                                    : i === phaseIdx ? 'bg-purple-600/60 text-white'
                                        : 'bg-slate-700/40 text-slate-500'}`}>
                                    {p.emoji} GĐ{i + 1}{i < phaseIdx ? ' ✓' : ''}
                                </div>
                            ))}
                        </div>

                        {/* BOSS */}
                        <div className={`bg-slate-900/80 p-4 rounded-xl border border-purple-500/30 space-y-2 ${shake ? 'animate-[shake_.3s]' : ''}`}>
                            <div className="text-sm font-bold text-purple-200 flex justify-between">
                                <span>{phase.emoji} {phase.name}</span><span>{bossHP}/{phase.maxHP}</span>
                            </div>
                            <Bar val={bossHP} max={phase.maxHP} from={phase.barFrom} to={phase.barTo} />
                            <div className="flex justify-between text-[10px] text-amber-300/90 pt-1">
                                <span>Tích tụ tư bản</span><span>{accum}%{accum >= 60 ? ' ⚠️ (sơ hở!)' : ''}</span>
                            </div>
                            <Bar val={accum} max={100} from="from-amber-400" to="to-red-500" />
                        </div>

                        {/* PHE TA */}
                        <div className="bg-slate-900/80 p-4 rounded-xl border border-green-500/30 space-y-2">
                            <div className="text-sm font-bold text-green-300 flex justify-between">
                                <span>✊ LỰC LƯỢNG TIẾN BỘ</span><span>{playerHP}/{PLAYER_MAX}</span>
                            </div>
                            <Bar val={playerHP} max={PLAYER_MAX} from="from-green-500" to="to-emerald-400" />
                        </div>

                        {/* HAND */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vũ khí lý luận (chọn 1 để đánh)</h3>
                            <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                                {hand.map((card) => (
                                    <button key={card.instanceId} onClick={() => playCard(card)}
                                        className={`w-full text-left p-3 rounded-xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-between bg-gradient-to-r ${card.color} text-white shadow-md`}>
                                        <div className="pr-2">
                                            <div className="font-bold text-sm flex items-center gap-1.5">
                                                <span className="bg-black/30 text-[9px] px-1.5 py-0.5 rounded">{card.tag}</span>{card.name}
                                            </div>
                                            <div className="text-[10px] opacity-90 font-light mt-0.5">{card.desc}</div>
                                        </div>
                                        <span className="bg-black/25 text-xs px-2 py-1 rounded-md font-mono font-bold shrink-0">
                                            {card.type === 'heal' ? `+${card.value}` : `-${card.value}`}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* LOG */}
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhật ký chiến sự</h3>
                            <div ref={logRef} className="bg-slate-900 p-3 rounded-xl h-24 overflow-y-auto text-[11px] font-mono space-y-1 text-slate-300">
                                {log.map((item, idx) => (
                                    <div key={idx} className={idx === 0 ? 'text-yellow-400 font-bold' : ''}>{item}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== WON ===== */}
                {gameState === 'WON' && (
                    <div className="text-center space-y-5 py-2">
                        <div className="text-6xl">🏆</div>
                        <h2 className="text-2xl font-black text-green-400 uppercase">Chiến thắng!</h2>
                        <p className="text-sm text-slate-300">
                            Nhóm <strong className="text-yellow-400">{teamName}</strong> đã hạ cả 3 giai đoạn độc quyền bằng vũ khí lý luận 4.1 & 4.2!
                        </p>
                        <div className="bg-slate-900 p-4 rounded-xl border border-green-500/30">
                            <div className="text-xs text-slate-400">SỐ LƯỢT ĐÃ DÙNG</div>
                            <div className="text-4xl font-black text-yellow-400 mt-1">{turnCount} Lượt</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-2 tracking-widest">MÃ XÁC THỰC: VICTORY_MAC_LENIN_2026</div>
                        </div>
                        <div className="bg-slate-700/40 p-3 rounded-xl text-left text-[10px] text-slate-300 space-y-1">
                            <p className="font-bold text-yellow-400">📘 Tóm tắt 5 đặc điểm độc quyền (Lênin):</p>
                            <p>1. Tổ chức độc quyền (Cartel, Syndicate, Trust, Consortium)</p>
                            <p>2. Tư bản tài chính & đầu sỏ tài chính</p>
                            <p>3. Xuất khẩu tư bản · 4. Phân chia thế giới về kinh tế · 5. Về lãnh thổ</p>
                        </div>
                        <p className="text-xs text-red-400 animate-pulse">Chụp màn hình này & báo cáo Giảng viên để ghi điểm!</p>
                        <button onClick={resetGame} className="w-full py-2 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl text-sm">CHƠI LẠI</button>
                    </div>
                )}

                {/* ===== LOST ===== */}
                {gameState === 'LOST' && (
                    <div className="text-center space-y-5 py-2">
                        <div className="text-6xl">💀</div>
                        <h2 className="text-2xl font-black text-red-500 uppercase">Thất bại</h2>
                        <p className="text-sm text-slate-300">Bạn đã trụ tới <strong className="text-purple-300">{phase.name}</strong>. Hãy ôn lại 4.1 & 4.2 rồi phản công!</p>
                        <button onClick={resetGame} className="w-full py-3 bg-slate-700 hover:bg-slate-600 font-bold rounded-xl transition">THỬ LẠI</button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
        </div>
    );
}
