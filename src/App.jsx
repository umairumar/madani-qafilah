import { useState, useEffect } from "react";
import ExpenseManager from "./ExpenseManager";
import {
  ISLAMIC_MONTHS,
  MONTHLY_SUNNAHS,
  MONTHLY_DUAS,
  MONTHLY_SALAH_LAWS,
  SCHEDULE,
  typeColors,
  typeLabels,
  DAY_GUIDES,
} from "./qafilahData";
import {
  STORAGE_KEYS,
  DEFAULT_JOURNEY,
  load,
  save,
  monthDayKey,
} from "./storage";
import { buildReportSummary, generateReportPdf } from "./generateReportPdf";

const inputStyle = {
  width: "100%",
  background: "#141420",
  border: "1px solid #2a2a3a",
  borderRadius: 8,
  padding: "8px 12px",
  color: "#e6e6e6",
  fontSize: 12,
  boxSizing: "border-box",
};

function CompletionCheckbox({ isDone, onToggle, size = 18 }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        width: size,
        height: size,
        borderRadius: 5,
        border: `2px solid ${isDone ? "#4a8" : "#334"}`,
        background: isDone ? "#2d6b4a" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      {isDone && <span style={{ color: "#7fd4a0", fontSize: 11 }}>✓</span>}
    </div>
  );
}

function formatDisplayDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("schedule");
  const [qafilaType, setQafilaType] = useState(3);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(ISLAMIC_MONTHS[0]);
  const [expandedSession, setExpandedSession] = useState("fajr");
  const [checkedItems, setCheckedItems] = useState(() => load(STORAGE_KEYS.CHECKLIST, {}));
  const [sunnahsDone, setSunnahsDone] = useState(() => load(STORAGE_KEYS.SUNNAHS_DONE, {}));
  const [duasDone, setDuasDone] = useState(() => load(STORAGE_KEYS.DUAS_DONE, {}));
  const [salahDone, setSalahDone] = useState(() => load(STORAGE_KEYS.SALAH_DONE, {}));
  const [journey, setJourney] = useState(() => ({ ...DEFAULT_JOURNEY, ...load(STORAGE_KEYS.JOURNEY, {}) }));
  const [brothers, setBrothers] = useState(() => load(STORAGE_KEYS.BROTHERS, []));
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => { save(STORAGE_KEYS.CHECKLIST, checkedItems); }, [checkedItems]);
  useEffect(() => { save(STORAGE_KEYS.SUNNAHS_DONE, sunnahsDone); }, [sunnahsDone]);
  useEffect(() => { save(STORAGE_KEYS.DUAS_DONE, duasDone); }, [duasDone]);
  useEffect(() => { save(STORAGE_KEYS.SALAH_DONE, salahDone); }, [salahDone]);
  useEffect(() => { save(STORAGE_KEYS.JOURNEY, journey); }, [journey]);

  useEffect(() => {
    const syncBrothers = () => setBrothers(load(STORAGE_KEYS.BROTHERS, []));
    window.addEventListener("storage", syncBrothers);
    return () => window.removeEventListener("storage", syncBrothers);
  }, [tab]);

  const updateJourney = (field, value) => setJourney((prev) => ({ ...prev, [field]: value }));

  const checklistKey = (sessionId, idx) => `${currentDay}-${sessionId}-${idx}`;

  const toggleCheck = (sessionId, idx) => {
    const key = checklistKey(sessionId, idx);
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSunnahDone = (day) => {
    const key = monthDayKey(selectedMonth, day);
    setSunnahsDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDuaDone = (day) => {
    const key = monthDayKey(selectedMonth, day);
    setDuasDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSalahDone = (day) => {
    const key = monthDayKey(selectedMonth, day);
    setSalahDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const todayGuide = DAY_GUIDES[3]?.find((d) => d.day === Math.min(currentDay, 3));
  const monthSunnahs = MONTHLY_SUNNAHS[selectedMonth] || [];
  const monthDuas = MONTHLY_DUAS[selectedMonth] || [];
  const monthSalahLaws = MONTHLY_SALAH_LAWS[selectedMonth] || [];
  const todaySunnahs = qafilaType === 3 ? monthSunnahs.filter((s) => s.day === currentDay) : monthSunnahs;
  const todayDuas = qafilaType === 3 ? monthDuas.filter((d) => d.day === currentDay) : monthDuas;
  const todaySalahLaws = qafilaType === 3 ? monthSalahLaws.filter((s) => s.day === currentDay) : monthSalahLaws;

  const perDayTotal = SCHEDULE.reduce((s, sess) => s + sess.activities.length, 0);
  const dayDone = SCHEDULE.reduce((count, session) => {
    return count + session.activities.filter((_, i) => checkedItems[checklistKey(session.id, i)]).length;
  }, 0);
  const dayPct = Math.round((dayDone / perDayTotal) * 100);

  const tripTotal = perDayTotal * qafilaType;
  const tripDone = Object.entries(checkedItems).filter(([key, val]) => {
    if (!val) return false;
    const day = parseInt(key.split("-")[0], 10);
    return day >= 1 && day <= qafilaType;
  }).length;
  const tripPct = tripTotal ? Math.round((tripDone / tripTotal) * 100) : 0;

  const reportSummary = buildReportSummary({
    journey,
    brothers,
    qafilaType,
    selectedMonth,
    checkedItems,
    sunnahsDone,
    duasDone,
    salahDone,
  });

  const canDownloadReport =
    journey.fromCity.trim() &&
    journey.toCity.trim() &&
    brothers.length > 0;

  const handleDownloadReport = () => {
    generateReportPdf({
      journey,
      brothers,
      qafilaType,
      selectedMonth,
      checkedItems,
      sunnahsDone,
      duasDone,
      salahDone,
    });
  };

  const mainTabs = [
    ["journey", "🚌 Journey"],
    ["schedule", "📋 Schedule"],
    ["sunnahs", "📿 Sunnahs"],
    ["duas", "🤲 Du'as"],
    ["salah", "🙏 Salah"],
    ["expenses", "💰 Expenses"],
    ["report", "📄 PDF"],
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0d1117", minHeight: "100vh", color: "#e6e6e6" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1a0a30 0%, #0d1a30 100%)", padding: "16px 16px 0", borderBottom: "1px solid #2a2a4a" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 26 }}>🕌</span>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#d4af7a" }}>Madani Qafilah</div>
              <div style={{ fontSize: 10, color: "#8899aa", letterSpacing: 1, textTransform: "uppercase" }}>Path to Piety Companion</div>
            </div>
          </div>

          {/* Controls Row */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 2 }}>
            {/* Qafilah type */}
            <div style={{ display: "flex", background: "#1a1a2e", borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a4a" }}>
              {[3, 12, 30].map(d => (
                <button key={d} onClick={() => { setQafilaType(d); setCurrentDay(1); }}
                  style={{ padding: "5px 12px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600,
                    background: qafilaType === d ? "#d4af7a" : "transparent",
                    color: qafilaType === d ? "#1a1a2e" : "#8899aa" }}>
                  {d}-Day
                </button>
              ))}
            </div>

            {/* Day selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#1a1a2e", borderRadius: 8, padding: "4px 10px", border: "1px solid #2a2a4a" }}>
              <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))}
                style={{ border: "none", background: "none", color: "#d4af7a", cursor: "pointer", fontSize: 14, padding: 0 }}>◀</button>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e6e6e6", minWidth: 52, textAlign: "center" }}>Day {currentDay}/{qafilaType}</span>
              <button onClick={() => setCurrentDay(d => Math.min(qafilaType, d + 1))}
                style={{ border: "none", background: "none", color: "#d4af7a", cursor: "pointer", fontSize: 14, padding: 0 }}>▶</button>
            </div>

            {/* Month picker */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMonthPicker(p => !p)}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "#1a1a2e", border: "1px solid #3a2a6a",
                  borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "#c0a0f0", fontSize: 11, fontWeight: 600 }}>
                🌙 {selectedMonth.split("-")[0]}
                <span style={{ fontSize: 9, color: "#667" }}>▼</span>
              </button>
              {showMonthPicker && (
                <div style={{ position: "absolute", top: "110%", left: 0, background: "#1a1a2e", border: "1px solid #3a3a5a",
                  borderRadius: 10, zIndex: 100, minWidth: 200, boxShadow: "0 8px 32px #000a" }}>
                  {ISLAMIC_MONTHS.map((m, i) => (
                    <button key={m} onClick={() => { setSelectedMonth(m); setShowMonthPicker(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "9px 14px", border: "none", cursor: "pointer",
                        background: selectedMonth === m ? "#2d1a4a" : "transparent",
                        color: selectedMonth === m ? "#d4af7a" : "#c0c0d0",
                        fontSize: 12, borderBottom: i < 11 ? "1px solid #2a2a3a" : "none" }}>
                      {i + 1}. {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", marginTop: 10, overflowX: "auto" }}>
            {mainTabs.map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setBrothers(load(STORAGE_KEYS.BROTHERS, [])); }}
                style={{ flex: "1 0 auto", padding: "9px 4px", border: "none", minWidth: 52,
                  borderBottom: tab === id ? "2px solid #d4af7a" : "2px solid transparent",
                  background: "transparent", color: tab === id ? "#d4af7a" : "#8899aa",
                  cursor: "pointer", fontSize: 9, fontWeight: tab === id ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 14 }} onClick={() => showMonthPicker && setShowMonthPicker(false)}>

        {/* ── JOURNEY TAB ── */}
        {tab === "journey" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a2030,#0d1a30)", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid #2a3a4a" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>🚌 Journey Details</div>
              <div style={{ fontSize: 11, color: "#8899aa" }}>Set where your Qafilah is travelling from and to, plus the venue details for this trip.</div>
            </div>

            <div style={{ background: "#141420", borderRadius: 12, padding: "14px", border: "1px solid #2a2a3a" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>From city</div>
                  <input value={journey.fromCity} onChange={(e) => updateJourney("fromCity", e.target.value)}
                    placeholder="e.g. Manchester" style={inputStyle} />
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>To city (destination)</div>
                  <input value={journey.toCity} onChange={(e) => updateJourney("toCity", e.target.value)}
                    placeholder="e.g. Bradford" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Venue name</div>
                <input value={journey.venueName} onChange={(e) => updateJourney("venueName", e.target.value)}
                  placeholder="e.g. Faizan-e-Madinah" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Venue address</div>
                <textarea value={journey.venueAddress} onChange={(e) => updateJourney("venueAddress", e.target.value)}
                  placeholder="Full address of the venue" rows={3}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Start date</div>
                  <input type="date" value={journey.startDate} onChange={(e) => updateJourney("startDate", e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>End date</div>
                  <input type="date" value={journey.endDate} onChange={(e) => updateJourney("endDate", e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SCHEDULE TAB ── */}
        {tab === "schedule" && (
          <div>
            {todayGuide && (
              <div style={{ background: "linear-gradient(135deg,#2d1a4a,#1a0d30)", borderRadius: 12, padding: "11px 14px", marginBottom: 12, border: "1px solid #4a2d6b" }}>
                <div style={{ fontSize: 10, color: "#a07fd4", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Day {currentDay} — Tonight's Maghrib Topic</div>
                <div style={{ fontSize: 12, color: "#d4c0f0" }}>{todayGuide.maghrib}</div>
              </div>
            )}

            {SCHEDULE.map(session => {
              const isOpen = expandedSession === session.id;
              const completedCount = session.activities.filter((_, i) => checkedItems[checklistKey(session.id, i)]).length;
              return (
                <div key={session.id} style={{ marginBottom: 8, borderRadius: 12, overflow: "hidden", border: "1px solid #2a2a3a" }}>
                  <button onClick={() => setExpandedSession(isOpen ? null : session.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                      background: isOpen ? "#1a2030" : "#141420", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 20 }}>{session.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a" }}>{session.label}</div>
                      <div style={{ fontSize: 10, color: "#6677aa" }}>{session.time}</div>
                    </div>
                    {completedCount > 0 && (
                      <span style={{ background: "#2d6b4a", color: "#7fd4a0", fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>
                        {completedCount}/{session.activities.length}
                      </span>
                    )}
                    <span style={{ color: "#446", fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div style={{ background: "#0f1219", padding: "6px 10px 10px" }}>
                      {session.activities.map((act, i) => {
                        const key = checklistKey(session.id, i);
                        const isDone = checkedItems[key];
                        return (
                          <div key={i} onClick={() => toggleCheck(session.id, i)}
                            style={{ display: "flex", gap: 8, padding: "9px 6px", borderRadius: 8, cursor: "pointer",
                              background: isDone ? "#0d1f14" : "transparent", marginBottom: 3,
                              borderLeft: `3px solid ${typeColors[act.type] || "#333"}` }}>
                            <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${isDone ? "#4a8" : "#334"}`,
                              background: isDone ? "#2d6b4a" : "transparent", display: "flex", alignItems: "center",
                              justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                              {isDone && <span style={{ color: "#7fd4a0", fontSize: 11 }}>✓</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3,
                                background: typeColors[act.type] + "40", color: "#ccc",
                                border: `1px solid ${typeColors[act.type]}55`, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3, display: "inline-block" }}>
                                {typeLabels[act.type]}
                              </span>
                              <div style={{ fontSize: 11, color: isDone ? "#5a9a6a" : "#c8d0dc", textDecoration: isDone ? "line-through" : "none", lineHeight: 1.5 }}>{act.task}</div>
                              <div style={{ fontSize: 10, color: "#4a5a6a" }}>{act.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Progress */}
            <div style={{ background: "#141420", borderRadius: 12, padding: "12px 14px", marginTop: 4, border: "1px solid #2a2a3a" }}>
              <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Day {currentDay}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#d4af7a", fontWeight: 600 }}>{dayDone} of {perDayTotal} today</span>
                <span style={{ fontSize: 12, color: "#7fd4a0" }}>{dayPct}%</span>
              </div>
              <div style={{ height: 5, background: "#1e2030", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${dayPct}%`, background: "linear-gradient(90deg,#2d6b4a,#7fd4a0)", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#8899aa" }}>Full trip: {tripDone} of {tripTotal}</span>
                <span style={{ fontSize: 12, color: "#7fd4a0" }}>{tripPct}%</span>
              </div>
              <div style={{ height: 5, background: "#1e2030", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${tripPct}%`, background: "linear-gradient(90deg,#2d4a6b,#7aa0d4)", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              {tripDone > 0 && (
                <button onClick={() => setCheckedItems({})} style={{ marginTop: 8, fontSize: 10, color: "#556", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Reset all checklist
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── SUNNAHS TAB ── */}
        {tab === "sunnahs" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a2030,#1a0d30)", borderRadius: 12, padding: "12px 14px", marginBottom: 12, border: "1px solid #2a3a4a" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>🌙 {selectedMonth}</div>
              <div style={{ fontSize: 11, color: "#8899aa" }}>
                Sunnah learning session: <strong style={{ color: "#c8d0dc" }}>12:00–12:30 PM</strong> daily.
                {qafilaType === 3 ? " Showing today's topic only." : " All days shown for this month."}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>📿 Sunnahs & Manners</div>
              {(qafilaType === 3 ? todaySunnahs : monthSunnahs).map((s, i) => {
                const isDone = !!sunnahsDone[monthDayKey(selectedMonth, s.day)];
                return (
                <div key={i} onClick={() => toggleSunnahDone(s.day)}
                  style={{ background: isDone ? "#0d1f14" : "#141420", borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid #2a3a3a", borderLeft: "3px solid #2d6b4a", cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <CompletionCheckbox isDone={isDone} onToggle={() => toggleSunnahDone(s.day)} />
                    <div style={{ flex: 1 }}>
                      {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#5a9a6a", marginBottom: 4 }}>Day {s.day}</div>}
                      <div style={{ fontSize: 13, color: isDone ? "#5a9a6a" : "#c8d0dc", fontWeight: 500, marginBottom: 4, textDecoration: isDone ? "line-through" : "none" }}>{s.topic}</div>
                      <div style={{ fontSize: 10, color: "#4a6a5a", background: "#0d1f14", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>📖 {s.ref}</div>
                    </div>
                  </div>
                </div>
              );})}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🙏 Laws of Salah (30 min)</div>
              {(qafilaType === 3 ? todaySalahLaws : monthSalahLaws).map((s, i) => {
                const isDone = !!salahDone[monthDayKey(selectedMonth, s.day)];
                return (
                <div key={i} onClick={() => toggleSalahDone(s.day)}
                  style={{ background: isDone ? "#0d1420" : "#141420", borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid #2a2a4a", borderLeft: "3px solid #2d4a6b", cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <CompletionCheckbox isDone={isDone} onToggle={() => toggleSalahDone(s.day)} />
                    <div style={{ flex: 1 }}>
                      {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#5a7aaa", marginBottom: 4 }}>Day {s.day}</div>}
                      <div style={{ fontSize: 13, color: isDone ? "#5a7aaa" : "#c8d0dc", fontWeight: 500, marginBottom: 4, textDecoration: isDone ? "line-through" : "none" }}>{s.topic}</div>
                      <div style={{ fontSize: 10, color: "#4a5a7a", background: "#0d1420", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>📖 {s.ref}</div>
                    </div>
                  </div>
                </div>
              );})}
            </div>

            {qafilaType !== 3 && (
              <div style={{ background: "#141420", borderRadius: 12, padding: "12px 14px", border: "1px solid #2a2a3a", marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af7a", marginBottom: 6 }}>12-Day Qafilah — Sunnah Sequence</div>
                {["Eating meal","Istinja (purification)","Using Miswak","Sitting and standing","Sleeping","Revision","Drinking water","Applying 'Itr","Sneezing","Entering & leaving home","Applying oil","Revision"].map((t,i) => (
                  <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom: i<11?"1px solid #1e2030":"none" }}>
                    <span style={{ color:"#d4af7a", fontSize:11, flexShrink:0, minWidth:18 }}>Day {i+1}</span>
                    <span style={{ fontSize:11, color:"#c0c8d8" }}>{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── DU'AS TAB ── */}
        {tab === "duas" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a2030,#1a0d30)", borderRadius: 12, padding: "12px 14px", marginBottom: 12, border: "1px solid #2a3a4a" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>🌙 {selectedMonth}</div>
              <div style={{ fontSize: 11, color: "#8899aa" }}>
                Du'a session: <strong style={{ color: "#c8d0dc" }}>Summer — 19 min after midday · Winter — 19 min after Isha</strong>.
                {qafilaType === 3 ? " Showing today's du'a only." : " All days shown for this type."}
              </div>
            </div>

            {(qafilaType === 3 ? todayDuas : monthDuas).map((d, i) => {
              const isDone = !!duasDone[monthDayKey(selectedMonth, d.day)];
              return (
              <div key={i} onClick={() => toggleDuaDone(d.day)}
                style={{ background: isDone ? "#1a0d20" : "#141420", borderRadius: 12, padding: "14px", marginBottom: 10, border: "1px solid #2a2a4a", borderLeft: "3px solid #6b2d4a", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <CompletionCheckbox isDone={isDone} onToggle={() => toggleDuaDone(d.day)} />
                  <div style={{ flex: 1 }}>
                    {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#aa5a7a", marginBottom: 4 }}>Day {d.day}</div>}
                    <div style={{ fontSize: 13, color: isDone ? "#8a6a8a" : "#d4c0e0", fontWeight: 600, marginBottom: 6, textDecoration: isDone ? "line-through" : "none" }}>{d.dua}</div>
                    <div style={{ fontSize: 10, color: "#6a4a6a", background: "#1a0d20", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>
                      📖 Path to Piety, page {d.page}
                    </div>
                  </div>
                  <span style={{ fontSize: 22, opacity: 0.5 }}>🤲</span>
                </div>
              </div>
            );})}

            {qafilaType !== 3 && (
              <div style={{ background: "#141420", borderRadius: 12, padding: "12px 14px", border: "1px solid #2a2a3a", marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af7a", marginBottom: 6 }}>12-Day Qafilah — Du'a Sequence</div>
                {[
                  { day:1, dua:"Du'a when exiting home", page:351 },
                  { day:2, dua:"Du'a for getting on a vehicle", page:350 },
                  { day:3, dua:"Du'a for entering the toilet", page:343 },
                  { day:4, dua:"Du'a before sleeping", page:351 },
                  { day:5, dua:"Du'a before eating", page:347 },
                  { day:6, dua:"Du'a when entering the home", page:350 },
                  { day:7, dua:"First and second Kalimah", page:355 },
                  { day:8, dua:"Du'a upon seeing a Muslim smiling", page:345 },
                  { day:9, dua:"Du'a when entering the Masjid", page:345 },
                  { day:10, dua:"Du'a when leaving the Masjid", page:346 },
                  { day:11, dua:"Third Kalimah", page:355 },
                  { day:12, dua:"Fourth Kalimah", page:356 },
                ].map((d,i) => (
                  <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom: i<11?"1px solid #1e2030":"none" }}>
                    <span style={{ color:"#d4af7a", fontSize:11, flexShrink:0, minWidth:18 }}>Day {d.day}</span>
                    <span style={{ fontSize:11, color:"#c0c8d8", flex:1 }}>{d.dua}</span>
                    <span style={{ fontSize:10, color:"#5a4a6a" }}>p.{d.page}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SALAH LAWS TAB ── */}
        {tab === "salah" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a2030,#0d1a30)", borderRadius: 12, padding: "12px 14px", marginBottom: 12, border: "1px solid #2a3a4a" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>🌙 {selectedMonth}</div>
              <div style={{ fontSize: 11, color: "#8899aa" }}>
                Laws of Salah session: <strong style={{ color: "#c8d0dc" }}>30 min after Zuhr Dars</strong>. Read aloud from the book; Ameer selects what to memorise vs read.
              </div>
            </div>

            {(qafilaType === 3 ? todaySalahLaws : monthSalahLaws).map((s, i) => (
              <div key={i} style={{ background: "#141420", borderRadius: 12, padding: "14px", marginBottom: 10, border: "1px solid #2a2a4a", borderLeft: "3px solid #2d4a6b" }}>
                {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#5a7aaa", marginBottom: 4 }}>Day {s.day}</div>}
                <div style={{ fontSize: 13, color: "#c8d0dc", fontWeight: 500, marginBottom: 6, lineHeight: 1.5 }}>{s.topic}</div>
                <div style={{ fontSize: 10, color: "#4a5a7a", background: "#0d1420", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>📖 {s.ref}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── REPORT TAB ── */}
        {tab === "report" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a2030,#0d1a30)", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid #2a3a4a" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>📄 Trip Report</div>
              <div style={{ fontSize: 11, color: "#8899aa" }}>Download a PDF summary of your full Qafilah — journey, brothers, completed activities, sunnahs and du'as.</div>
            </div>

            {(journey.fromCity || journey.toCity) && (
              <div style={{ background: "#141420", borderRadius: 12, padding: "14px", marginBottom: 12, border: "1px solid #2a2a3a" }}>
                <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Journey</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#d4af7a", marginBottom: 6 }}>
                  {journey.fromCity || "—"} → {journey.toCity || "—"}
                </div>
                {journey.venueName && <div style={{ fontSize: 12, color: "#c8d0dc", marginBottom: 4 }}>{journey.venueName}</div>}
                {journey.venueAddress && <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4, lineHeight: 1.5 }}>{journey.venueAddress}</div>}
                <div style={{ fontSize: 11, color: "#8899aa" }}>
                  {formatDisplayDate(journey.startDate)} – {formatDisplayDate(journey.endDate)}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 14 }}>
              {[
                { val: brothers.length, lbl: "Brothers" },
                { val: reportSummary.activityCount, lbl: "Activities done" },
                { val: reportSummary.sunnahCount + reportSummary.salahCount, lbl: "Sunnahs / Salah" },
                { val: reportSummary.duaCount, lbl: "Du'as done" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#141420", borderRadius: 10, padding: "10px", textAlign: "center", border: "1px solid #2a2a3a" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#d4af7a" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#8899aa", marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>

            {brothers.length > 0 && (
              <div style={{ background: "#141420", borderRadius: 12, padding: "14px", marginBottom: 14, border: "1px solid #2a2a3a" }}>
                <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Brothers travelled</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {brothers.map((b) => (
                    <span key={b} style={{ background: "#1a1a2e", border: "1px solid #2a2a3a", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>{b}</span>
                  ))}
                </div>
              </div>
            )}

            {!canDownloadReport && (
              <div style={{ background: "#1a1520", borderRadius: 10, padding: "12px 14px", marginBottom: 12, border: "1px solid #3a2a4a", fontSize: 11, color: "#a07fd4", lineHeight: 1.6 }}>
                To download the PDF, fill in <strong>from city</strong> and <strong>to city</strong> on the Journey tab, and add at least one brother on the Expenses tab.
              </div>
            )}

            <button onClick={handleDownloadReport} disabled={!canDownloadReport}
              style={{
                width: "100%", background: canDownloadReport ? "#d4af7a" : "#3a3a4a", border: "none", borderRadius: 8,
                padding: "12px", color: canDownloadReport ? "#1a1a2e" : "#8899aa", fontWeight: 700, cursor: canDownloadReport ? "pointer" : "not-allowed", fontSize: 13,
              }}>
              ⬇ Download PDF Report
            </button>
          </div>
        )}

        {/* ── EXPENSES TAB ── */}
        {tab === "expenses" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#1a2a1a,#0d1a0d)", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid #2a3a2a" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7fd4a0", marginBottom: 2 }}>💰 Qafilah Expense Manager</div>
              <div style={{ fontSize: 11, color: "#8899aa" }}>Track shared expenses, set custom contributions per brother, and calculate who owes who. Works fully offline.</div>
            </div>
            <ExpenseManager />
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 10, color: "#334", lineHeight: 1.7 }}>
          Based on "Path to Piety" (Nayk Bannay aur Bananay kay Tareeqay)<br />
          Majlis Madani Qafilah & Al-Madina-tul-'Ilmiyyah · Dawat-e-Islami
        </div>
      </div>
    </div>
  );
}
