import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SCHEDULE = [
  {
    id: "tahajjud",
    time: "Pre-Fajr",
    label: "Tahajjud & Preparation",
    color: "#1a1040",
    icon: "🌙",
    activities: [
      { time: "19 min before Subh-e-Sadiq", task: "Wake up & offer Salat-ut-Tahajjud", type: "salah" },
      { time: "Before Fajr Azan", task: "Brothers going to nearby Masajid for Dars should leave now", type: "travel" },
      { time: "After Fajr Azan", task: "Call out Sada-e-Madinah (wake up call for Fajr)", type: "action" },
    ]
  },
  {
    id: "fajr",
    time: "Fajr",
    label: "Fajr Salah & Halqah",
    color: "#2d4a6b",
    icon: "🕌",
    activities: [
      { time: "After Fajr Salah", task: "Bayan (7–12 min) — Topics: Zikrullah / Bismillah virtues / Quran recitation / Salat-Alan-Nabi", type: "bayan" },
      { time: "Fajr Halqah", task: "Quran recitation (translation & commentary) — Madani In'aam no. 21", type: "learning" },
      { time: "Fajr Halqah", task: "Study Faizan-e-Sunnat passage", type: "learning" },
      { time: "Fajr Halqah", task: "Revision of previously learned Sunnahs & Duas", type: "learning" },
    ]
  },
  {
    id: "morning",
    time: "9:30 AM",
    label: "Morning Sessions",
    color: "#3a6b4a",
    icon: "☀️",
    activities: [
      { time: "9:30 – 9:56 AM", task: "Mashwarah (Consultation): 5 min Quran & Na'at, then schedule revision & Madani In'amaat booklet distribution (21 min)", type: "admin" },
      { time: "9:56 – 10:37 AM", task: "Bayan on Madani Mission (41 min): 26 min speech from Ameer-e-Ahl-e-Sunnat's booklets + 15 min mindset on 12 Madani tasks", type: "bayan" },
      { time: "10:37 – 10:56 AM", task: "Individual Worship (19 min): Quran recitation, Zikr, Salat-Alan-Nabi, study Madani In'amaat schedule", type: "ibadah" },
      { time: "10:56 – 11:08 AM", task: "Memorise short invitation towards righteousness (12 min)", type: "learning" },
      { time: "11:08 – 11:20 AM", task: "Method of Individual Effort (12 min) — Ameer demonstrates practically", type: "learning" },
      { time: "11:20 AM – 12:00 PM", task: "Individual Effort (40 min): Go out to invite people to Masjid. Some remain to discuss 12 Madani tasks", type: "action" },
    ]
  },
  {
    id: "zuhr",
    time: "Zuhr",
    label: "Zuhr & Afternoon",
    color: "#6b4a1a",
    icon: "🌤️",
    activities: [
      { time: "12:00 – 12:30 PM", task: "Learning Sunnahs session (Ameer teaches — sequence differs for 3-day / 12-day / 30-day Qafilah)", type: "learning" },
      { time: "12 min before Zuhr Azan", task: "Chowk Dars (7 min) from Faizan-e-Sunnat at the square, then bring people to Masjid", type: "action" },
      { time: "After Zuhr Salah", task: "Madani Dars (7 min) from Faizan-e-Sunnat", type: "dars" },
      { time: "After Zuhr Dars", task: "Namaz kay Ahkam — Laws of Salah (30 min)", type: "learning" },
      { time: "Afternoon", task: "Session: How to deliver Madani Dars & Bayan (19 min)", type: "learning" },
      { time: "Summer only (Winter: after Isha)", task: "Memorising Duas session (19 min)", type: "learning" },
      { time: "Rest Break", task: "Rest until Asr Salah", type: "rest" },
    ]
  },
  {
    id: "asr",
    time: "Asr",
    label: "Asr & Madani Visit",
    color: "#8b3a20",
    icon: "🕌",
    activities: [
      { time: "After Asr Salah", task: "Announcement & Bayan (12 min) — Topic: Virtues of calling towards righteousness", type: "bayan" },
      { time: "After Asr Bayan", task: "Madani Visit (door-to-door invitation)", type: "action" },
      { time: "Between Asr & Maghrib", task: "Madani Dars from Faizan-e-Sunnat & Bayanaat-e-Attariyyah. End with Sunnah learning session", type: "dars" },
    ]
  },
  {
    id: "maghrib",
    time: "Maghrib",
    label: "Maghrib Bayan & Dinner",
    color: "#4a1a6b",
    icon: "🌆",
    activities: [
      { time: "After Maghrib Salah", task: "Bayan by efficient Muballigh (topics vary by day — see Day Guide below)", type: "bayan" },
      { time: "After Bayan", task: "Individual effort for 12 minutes", type: "action" },
      { time: "Between Maghrib & Isha", task: "Dinner", type: "rest" },
    ]
  },
  {
    id: "isha",
    time: "Isha",
    label: "Isha & Night Session",
    color: "#1a2040",
    icon: "🌃",
    activities: [
      { time: "After Isha Salah", task: "Madani Dars (7 min) from Faizan-e-Sunnat", type: "dars" },
      { time: "After Dars", task: "7 min Individual effort, then CD/Cassette Bayan (or read booklet aloud)", type: "bayan" },
      { time: "Winter only", task: "Memorising Duas session (19 min) — in summer this is held at midday", type: "learning" },
      { time: "Night", task: "Revision session: Ameer revises day's learning; volunteers recite", type: "learning" },
      { time: "Before Sleep", task: "Collective Fikr-e-Madinah, Salat-ut-Taubah, listen to Surah Al-Mulk recitation", type: "ibadah" },
    ]
  },
];

const BAYANAAT = {
  fajr: [
    { no: 1, title: "Blessings of Zikrullah", page: 162 },
    { no: 2, title: "Excellence of Quran Recitation", page: 166 },
    { no: 3, title: "Excellence of Nawafil", page: 174 },
    { no: 4, title: "Excellence of Nafl Siyam (Optional Fasting)", page: 180 },
    { no: 5, title: "Excellence of Zikrullah (2nd)", page: 185 },
    { no: 6, title: "Blessings of Salat-o-Salam", page: 190 },
    { no: 7, "title": "Blessings of Bismillah", page: 198 },
    { no: 8, title: "Excellence of Zikr", page: 208 },
    { no: 9, title: "Method of acting upon Madani In'amaat", page: 217 },
  ],
  asr: [
    { no: 1, title: "Virtues of Calling Towards Righteousness", page: 231 },
    { no: 2, title: "Importance of Da'wah", page: 236 },
    { no: 3, title: "The Call to Good", page: 240 },
    { no: 4, title: "Responsibility of a Muslim", page: 243 },
    { no: 5, title: "Spreading the Deen", page: 245 },
    { no: 6, title: "Love for the Ummah", page: 249 },
    { no: 7, title: "Sacrifice for Allah's Path", page: 253 },
    { no: 8, title: "Sincerity in Da'wah", page: 255 },
    { no: 9, title: "Rewards of Individual Effort", page: 258 },
  ],
  maghrib: [
    { no: 1, title: "Tolerance and Forbearance", page: 261 },
    { no: 2, title: "Excellence of Spending in the Path of Allah", page: 266 },
    { no: 3, title: "Condemnation of Worldliness", page: 273 },
    { no: 4, title: "Call of the Grave", page: 279 },
    { no: 5, title: "Hidden Plan of Allah", page: 287 },
    { no: 6, title: "Accountability to Nafs", page: 294 },
    { no: 7, title: "Excellence of Forgiving and Tolerance", page: 302 },
    { no: 8, title: "Islamic Knowledge", page: 308 },
    { no: 9, title: "Generosity", page: 317 },
    { no: 10, title: "Aim of Life", page: 323 },
    { no: 11, title: "Good Manners", page: 332 },
  ],
};

const DAY_GUIDES = {
  3: [
    { day: 1, maghribTopic: "Importance of travelling in the path of Allah & virtues of intentions" },
    { day: 2, maghribTopic: "Persuade participants to present their names for the next Qafilah — record names" },
    { day: 3, maghribTopic: "Sacrifices of pious predecessors & motivation for next Qafilah. Last day: also hold Bayan after Maghrib and Dars after Isha" },
  ],
  12: [
    { day: 1, maghribTopic: "Importance of travelling in the path of Allah & virtues of intentions" },
    { day: 2, maghribTopic: "Tolerance and Forbearance (Maghrib Bayan 1)" },
    { day: 3, maghribTopic: "Excellence of Spending in the Path of Allah (Maghrib Bayan 2)" },
    { day: 4, maghribTopic: "Condemnation of Worldliness (Maghrib Bayan 3)" },
    { day: 5, maghribTopic: "Call of the Grave (Maghrib Bayan 4)" },
    { day: 6, maghribTopic: "Hidden Plan of Allah (Maghrib Bayan 5)" },
    { day: 7, maghribTopic: "Accountability to Nafs (Maghrib Bayan 6)" },
    { day: 8, maghribTopic: "Excellence of Forgiving and Tolerance (Maghrib Bayan 7)" },
    { day: 9, maghribTopic: "Islamic Knowledge (Maghrib Bayan 8)" },
    { day: 10, maghribTopic: "Generosity (Maghrib Bayan 9)" },
    { day: 11, maghribTopic: "Aim of Life (Maghrib Bayan 10)" },
    { day: 12, maghribTopic: "Good Manners (Maghrib Bayan 11) — Final day preparations" },
  ],
};

const DUAS = [
  { id: 1, title: "Du'a before studying a religious book", arabic: "اللَّهُمَّ افْتَحْ عَلَيْنَا حِكْمَتَكَ", urdu: "اے اللہ! ہم پر علم و حکمت کے دروازے کھول دے", translation: "O Allah! Open the doors of knowledge and wisdom for us, and have mercy on us, O the One Who is most Honourable and Glorious!", note: "Recite Salat-Alan-Nabi once before and after this Du'a. Ref: Al-Mustatraf, vol. 1, p. 40" },
  { id: 2, title: "Du'a for entering the Masjid", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", urdu: "", translation: "O Allah! Open for me the doors of Your mercy.", note: "Make intention of I'tikaf upon entering Masjid" },
  { id: 3, title: "Du'a for Fikr-e-Madinah (before sleeping)", arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ", urdu: "", translation: "Glory be to You, O Allah, and praise be to You.", note: "Performed collectively at night before rest. Accompanied by Salat-ut-Taubah." },
  { id: 4, title: "Du'a when departing on Qafilah", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا", urdu: "", translation: "Glory be to the One Who has subjected this to us, and we were not capable of subjecting it.", note: "Travel dua — to be recited when setting out" },
  { id: 5, title: "Du'a for entering a new area/locality", arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهَا", urdu: "", translation: "O Allah! Bless us in it (this place).", note: "Recite upon arrival at the locality where the Qafilah will stay" },
];

const SUNNAHS_BY_DAY = {
  "3-day": [
    "Eating with 3 fingers and licking them after eating",
    "Using Miswak before Wudu and Salah",
    "Saying Bismillah before every action",
    "Keeping eyes lowered when walking",
    "Sitting with both knees close together",
  ],
  "12-day": [
    "All 3-day Sunnahs plus:",
    "Sleeping on the right side with right hand under cheek",
    "Reciting Surah Al-Mulk before sleeping",
    "Making Du'a before and after eating",
    "Saying Alhamdulillah when sneezing",
    "Performing 4 Sunnahs of Zuhr before Fard",
  ],
  "30-day": [
    "All 12-day Sunnahs plus:",
    "Full Wudu before sleeping",
    "Tahajjud Salah every night",
    "Completing daily Quran reading routine",
    "Performing all Nafl Salahs of the day",
    "Full etiquette of Masjid: entering right foot first with Du'a",
  ],
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const typeColors = {
  salah: "#2d4a6b",
  bayan: "#6b2d4a",
  learning: "#2d6b4a",
  action: "#6b4a1a",
  ibadah: "#1a406b",
  dars: "#4a1a6b",
  rest: "#444",
  travel: "#1a5a4a",
  admin: "#555",
};

const typeLabels = {
  salah: "Salah",
  bayan: "Bayan",
  learning: "Learning",
  action: "Individual Effort",
  ibadah: "Ibadah",
  dars: "Dars",
  rest: "Rest",
  travel: "Journey",
  admin: "Mashwarah",
};

export default function App() {
  const [tab, setTab] = useState("schedule");
  const [qafilaType, setQafilaType] = useState(3);
  const [currentDay, setCurrentDay] = useState(1);
  const [expandedSession, setExpandedSession] = useState("fajr");
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedBayanTab, setSelectedBayanTab] = useState("fajr");
  const [expandedDua, setExpandedDua] = useState(null);

  const toggleCheck = (sessionId, idx) => {
    const key = `${sessionId}-${idx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const dayGuide = DAY_GUIDES[qafilaType] || DAY_GUIDES[3];
  const todayGuide = dayGuide?.find(d => d.day === currentDay) || dayGuide?.[0];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0d1117", minHeight: "100vh", color: "#e6e6e6" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0a30 0%, #0d1a30 100%)", padding: "20px 16px 0", borderBottom: "1px solid #2a2a4a" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🕌</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#d4af7a", letterSpacing: 0.5 }}>Madani Qafilah</div>
              <div style={{ fontSize: 11, color: "#8899aa", letterSpacing: 1, textTransform: "uppercase" }}>Path to Piety Companion</div>
            </div>
          </div>

          {/* Qafilah Type + Day Selector */}
          <div style={{ display: "flex", gap: 8, margin: "12px 0 0", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", background: "#1a1a2e", borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a4a" }}>
              {[3, 12, 30].map(d => (
                <button key={d} onClick={() => { setQafilaType(d); setCurrentDay(1); }}
                  style={{ padding: "5px 14px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: qafilaType === d ? "#d4af7a" : "transparent",
                    color: qafilaType === d ? "#1a1a2e" : "#8899aa" }}>
                  {d}-Day
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1a1a2e", borderRadius: 8, padding: "4px 10px", border: "1px solid #2a2a4a" }}>
              <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))}
                style={{ border: "none", background: "none", color: "#d4af7a", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>◀</button>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#e6e6e6", minWidth: 48, textAlign: "center" }}>Day {currentDay}/{qafilaType}</span>
              <button onClick={() => setCurrentDay(d => Math.min(qafilaType, d + 1))}
                style={{ border: "none", background: "none", color: "#d4af7a", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>▶</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 12 }}>
            {[["schedule", "📋 Schedule"], ["bayanaat", "🎤 Bayanaat"], ["duas", "🤲 Du'as"], ["sunnahs", "📿 Sunnahs"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex: 1, padding: "10px 4px", border: "none", borderBottom: tab === id ? "2px solid #d4af7a" : "2px solid transparent",
                  background: "transparent", color: tab === id ? "#d4af7a" : "#8899aa", cursor: "pointer", fontSize: 11, fontWeight: tab === id ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>

        {/* ── SCHEDULE TAB ── */}
        {tab === "schedule" && (
          <div>
            {/* Today's Maghrib topic */}
            {todayGuide && (
              <div style={{ background: "linear-gradient(135deg, #2d1a4a, #1a0d30)", borderRadius: 12, padding: "12px 16px", marginBottom: 14, border: "1px solid #4a2d6b" }}>
                <div style={{ fontSize: 10, color: "#a07fd4", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Day {currentDay} — Tonight's Maghrib Bayan Topic</div>
                <div style={{ fontSize: 13, color: "#d4c0f0", fontWeight: 500 }}>{todayGuide.maghribTopic}</div>
              </div>
            )}

            {SCHEDULE.map(session => {
              const isOpen = expandedSession === session.id;
              const completedCount = session.activities.filter((_, i) => checkedItems[`${session.id}-${i}`]).length;
              return (
                <div key={session.id} style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a3a" }}>
                  <button onClick={() => setExpandedSession(isOpen ? null : session.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                      background: isOpen ? "linear-gradient(90deg, #1a2030, #1a1a2e)" : "#141420",
                      border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 22 }}>{session.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#d4af7a" }}>{session.label}</div>
                      <div style={{ fontSize: 11, color: "#6677aa" }}>{session.time}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {completedCount > 0 && (
                        <span style={{ background: "#2d6b4a", color: "#7fd4a0", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                          {completedCount}/{session.activities.length}
                        </span>
                      )}
                      <span style={{ color: "#446", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ background: "#0f1219", padding: "8px 12px 12px" }}>
                      {session.activities.map((act, i) => {
                        const key = `${session.id}-${i}`;
                        const done = checkedItems[key];
                        return (
                          <div key={i} onClick={() => toggleCheck(session.id, i)}
                            style={{ display: "flex", gap: 10, padding: "10px 8px", borderRadius: 8, cursor: "pointer",
                              background: done ? "#0d1f14" : "transparent", marginBottom: 4,
                              borderLeft: `3px solid ${typeColors[act.type] || "#333"}` }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${done ? "#4a8" : "#334"}`,
                              background: done ? "#2d6b4a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                              {done && <span style={{ color: "#7fd4a0", fontSize: 12 }}>✓</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: typeColors[act.type] + "40",
                                  color: "#ccc", border: `1px solid ${typeColors[act.type]}55`, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                  {typeLabels[act.type]}
                                </span>
                              </div>
                              <div style={{ fontSize: 12, color: done ? "#5a9a6a" : "#c8d0dc", textDecoration: done ? "line-through" : "none" }}>{act.task}</div>
                              <div style={{ fontSize: 10, color: "#4a5a6a", marginTop: 2 }}>{act.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "#141420", borderRadius: 12, padding: "12px 16px", marginTop: 4, border: "1px solid #2a2a3a" }}>
              <div style={{ fontSize: 11, color: "#6677aa", marginBottom: 8 }}>Progress Today</div>
              {(() => {
                const total = SCHEDULE.reduce((s, sess) => s + sess.activities.length, 0);
                const done = Object.values(checkedItems).filter(Boolean).length;
                const pct = Math.round((done / total) * 100);
                return (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#d4af7a", fontWeight: 600 }}>{done} of {total} activities</span>
                      <span style={{ fontSize: 12, color: "#7fd4a0" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#1e2030", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #2d6b4a, #7fd4a0)", borderRadius: 4, transition: "width 0.3s" }} />
                    </div>
                    {done > 0 && (
                      <button onClick={() => setCheckedItems({})} style={{ marginTop: 10, fontSize: 11, color: "#667", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                        Reset day checklist
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── BAYANAAT TAB ── */}
        {tab === "bayanaat" && (
          <div>
            <div style={{ display: "flex", background: "#141420", borderRadius: 10, padding: 4, marginBottom: 14, gap: 4, border: "1px solid #2a2a3a" }}>
              {[["fajr", "🌅 Fajr"], ["asr", "🌤 Asr"], ["maghrib", "🌆 Maghrib"]].map(([id, label]) => (
                <button key={id} onClick={() => setSelectedBayanTab(id)}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                    background: selectedBayanTab === id ? "#d4af7a" : "transparent",
                    color: selectedBayanTab === id ? "#1a1a2e" : "#8899aa" }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 12, background: "#141420", borderRadius: 10, padding: "10px 14px", border: "1px solid #2a2a3a" }}>
              <div style={{ fontSize: 11, color: "#8899aa" }}>
                {selectedBayanTab === "fajr" && "Delivered after Fajr Salah (7–12 minutes). Select bayan number based on your day."}
                {selectedBayanTab === "asr" && "Delivered after Asr Salah (12 minutes). Topic: Virtues of calling towards righteousness."}
                {selectedBayanTab === "maghrib" && "Delivered by an efficient Muballigh after Maghrib Salah. Followed by 12 min individual effort."}
              </div>
            </div>

            {(BAYANAAT[selectedBayanTab] || []).map(bayan => (
              <div key={bayan.no} style={{ marginBottom: 8, background: "#141420", borderRadius: 10, padding: "12px 16px", border: "1px solid #2a2a3a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, background: "#2d1a4a", color: "#a07fd4", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>
                        Bayan {bayan.no}
                      </span>
                      <span style={{ fontSize: 10, color: "#4a5a6a" }}>Page {bayan.page}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#d4c0e0", fontWeight: 500, marginTop: 6 }}>{bayan.title}</div>
                  </div>
                  <span style={{ fontSize: 18, opacity: 0.4 }}>🎤</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DU'AS TAB ── */}
        {tab === "duas" && (
          <div>
            <div style={{ background: "#141420", borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: "1px solid #2a2a3a" }}>
              <div style={{ fontSize: 11, color: "#8899aa" }}>
                Du'as from Chapter 5 of Path to Piety (p. 343). Memorised during dedicated sessions in the Qafilah schedule.
              </div>
            </div>
            {DUAS.map(dua => (
              <div key={dua.id} style={{ marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a3a" }}>
                <button onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "13px 16px",
                    background: expandedDua === dua.id ? "#1a1a2e" : "#141420", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>🤲</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#d4af7a" }}>{dua.title}</div>
                  </div>
                  <span style={{ color: "#446", fontSize: 14 }}>{expandedDua === dua.id ? "▲" : "▼"}</span>
                </button>
                {expandedDua === dua.id && (
                  <div style={{ background: "#0f1219", padding: "12px 16px" }}>
                    <div style={{ textAlign: "right", fontSize: 20, color: "#d4af7a", lineHeight: 1.8, marginBottom: 12, fontFamily: "serif", direction: "rtl" }}>
                      {dua.arabic}
                    </div>
                    {dua.urdu && (
                      <div style={{ textAlign: "right", fontSize: 14, color: "#c0b0d4", lineHeight: 1.7, marginBottom: 10, direction: "rtl" }}>
                        {dua.urdu}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: "#a0b0c0", fontStyle: "italic", marginBottom: 10, lineHeight: 1.6, borderLeft: "3px solid #4a4a6a", paddingLeft: 10 }}>
                      {dua.translation}
                    </div>
                    <div style={{ fontSize: 10, color: "#4a5a6a", background: "#1a1a2e", borderRadius: 6, padding: "6px 10px" }}>
                      📝 {dua.note}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── SUNNAHS TAB ── */}
        {tab === "sunnahs" && (
          <div>
            <div style={{ background: "#141420", borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: "1px solid #2a2a3a" }}>
              <div style={{ fontSize: 11, color: "#8899aa" }}>
                Sunnahs are taught progressively. Sequence differs for 3-day, 12-day, and 30-day Qafilahs. Session: 12:00–12:30 PM daily.
              </div>
            </div>

            {[["3-day", "3-Day Qafilah"], ["12-day", "12-Day Qafilah"], ["30-day", "30-Day Qafilah"]].map(([key, label]) => (
              <div key={key} style={{ marginBottom: 12, background: "#141420", borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a3a" }}>
                <div style={{ padding: "12px 16px", background: key === `${qafilaType}-day` ? "#1a2030" : "#141420", borderBottom: "1px solid #2a2a3a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: key === `${qafilaType}-day` ? "#d4af7a" : "#8899aa" }}>{label}</span>
                    {key === `${qafilaType}-day` && <span style={{ fontSize: 9, background: "#d4af7a", color: "#1a1a2e", padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>CURRENT</span>}
                  </div>
                </div>
                <div style={{ padding: "10px 16px" }}>
                  {(SUNNAHS_BY_DAY[key] || []).map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < SUNNAHS_BY_DAY[key].length - 1 ? "1px solid #1e2030" : "none" }}>
                      <span style={{ color: "#d4af7a", fontSize: 12, flexShrink: 0, marginTop: 1 }}>📿</span>
                      <span style={{ fontSize: 12, color: "#c8d0dc", lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: "linear-gradient(135deg, #1a2030, #1a0d30)", borderRadius: 12, padding: "14px 16px", border: "1px solid #2a3a4a", marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 8 }}>📖 Madani In'amaat Reminder</div>
              <div style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.7 }}>
                72 Madani In'amaat for Islamic brothers · 63 for Islamic sisters · 92 for student brothers · 83 for student sisters · 40 for Madani children · 19 specific In'amaat for Hajj and Umrah pilgrims
              </div>
              <div style={{ fontSize: 11, color: "#7fd4a0", marginTop: 8 }}>
                ✅ Fill in your In'amaat booklet every night during Fikr-e-Madinah and submit monthly to your Zimmahdar.
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#334", lineHeight: 1.7 }}>
          Based on "Path to Piety" (Nayk Bannay aur Bananay kay Tareeqay)<br />
          Majlis Madani Qafilah & Al-Madina-tul-'Ilmiyyah, Dawat-e-Islami
        </div>
      </div>
    </div>
  );
}
