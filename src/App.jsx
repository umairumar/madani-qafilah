import { useState } from "react";

// ─── ISLAMIC MONTHS ──────────────────────────────────────────────────────────
const ISLAMIC_MONTHS = [
  "Muharram-ul-Haraam",
  "Safar-ul-Muzaffar",
  "Rabi-ul-Awwal",
  "Rabi-ul-Aakhir",
  "Jumadal Awwal",
  "Jumadal Aakhir",
  "Rajab-ul-Murajjab",
  "Sha'ban-ul-Mu'azzam",
  "Ramadan-ul-Mubarak",
  "Shawwal-ul-Mukarram",
  "Zul-Qa'da-til-Haraam",
  "Zul-Hijja-til-Haraam",
];

// ─── MONTHLY SUNNAH SCHEDULE (3-day Qafilah, 12 Islamic months) ──────────────
const MONTHLY_SUNNAHS = {
  "Muharram-ul-Haraam": [
    { day: 1, topic: "Sunnahs and manners of participating in the funeral procession and shouldering the bier", ref: "Laws of Salah, p.219" },
    { day: 2, topic: "Sunnahs and manners of entering the graveyard", ref: "p.443 of this book" },
    { day: 3, topic: "Sunnahs and manners of throwing a handful of earth onto the grave", ref: "Laws of Salah, p.267" },
  ],
  "Safar-ul-Muzaffar": [
    { day: 1, topic: "Sunnahs and manners of purification after excretion (Istinja)", ref: "p.446 of this book" },
    { day: 2, topic: "Sunnahs and manners of hair-cut and removing pubic hair", ref: "p.397 of this book" },
    { day: 3, topic: "Sunnahs and manners of wearing the 'Imamah (Islamic turban)", ref: "p.434 of this book" },
  ],
  "Rabi-ul-Awwal": [
    { day: 1, topic: "Sunnahs and manners of wearing clothes", ref: "p.431 of this book" },
    { day: 2, topic: "Sunnahs and manners of applying kohl (Surmah)", ref: "p.391 of this book" },
    { day: 3, topic: "Sunnahs and manners of embracing one another", ref: "p.367 of this book" },
  ],
  "Rabi-ul-Aakhir": [
    { day: 1, topic: "Sunnahs and manners of applying fragrance ('Itr)", ref: "p.412 of this book" },
    { day: 2, topic: "Sunnahs and manners of applying oil and combing", ref: "p.406 of this book" },
    { day: 3, topic: "Sunnahs and manners of clipping nails", ref: "p.400 of this book" },
  ],
  "Jumadal Awwal": [
    { day: 1, topic: "Sunnahs and manners of drinking water", ref: "p.422 of this book" },
    { day: 2, topic: "Sunnahs and manners of entering the Masjid", ref: "p.41 of this book" },
    { day: 3, topic: "Manners and Madani pearls of sitting in the Masjid", ref: "p.43 of this book" },
  ],
  "Jumadal Aakhir": [
    { day: 1, topic: "Sunnahs and manners of sitting in a congregation or gathering", ref: "p.429 of this book" },
    { day: 2, topic: "Sunnahs and manners of walking", ref: "p.426 of this book" },
    { day: 3, topic: "Sunnahs and manners of shaking hands", ref: "p.371 of this book" },
  ],
  "Rajab-ul-Murajjab": [
    { day: 1, topic: "Sunnahs and manners of hospitality", ref: "p.452 of this book" },
    { day: 2, topic: "Sunnahs and manners of adorning oneself", ref: "p.410 of this book" },
    { day: 3, topic: "Sunnahs and manners of sneezing", ref: "p.394 of this book" },
  ],
  "Sha'ban-ul-Mu'azzam": [
    { day: 1, topic: "Method and Madani pearls of performing Tayammum", ref: "Laws of Salah, p.71" },
    { day: 2, topic: "Sunnahs and manners of keeping Sunnah-conforming hairstyle", ref: "p.402 of this book" },
    { day: 3, topic: "Sunnahs and manners of talking", ref: "p.373 of this book" },
  ],
  "Ramadan-ul-Mubarak": [
    { day: 1, topic: "Sunnahs and manners of eating meal", ref: "p.417 of this book" },
    { day: 2, topic: "Sunnahs and manners of saying Salam", ref: "p.358 of this book" },
    { day: 3, topic: "Sunnahs and manners of using Miswak", ref: "p.441 of this book" },
  ],
  "Shawwal-ul-Mukarram": [
    { day: 1, topic: "Sunnahs and manners of travelling", ref: "p.383 of this book" },
    { day: 2, topic: "Sunnahs and manners of entering and leaving home", ref: "p.376 of this book" },
    { day: 3, topic: "Sunnahs and manners of wearing shoes", ref: "p.436 of this book" },
  ],
  "Zul-Qa'da-til-Haraam": [
    { day: 1, topic: "Sunnahs and manners of sleeping", ref: "p.438 of this book" },
    { day: 2, topic: "Sunnahs and manners of applying oil", ref: "p.406 of this book" },
    { day: 3, topic: "Sunnahs and manners of applying kohl (Surmah)", ref: "p.391 of this book" },
  ],
  "Zul-Hijja-til-Haraam": [
    { day: 1, topic: "Sunnahs and manners of hair-cut and removing pubic hair", ref: "p.397 of this book" },
    { day: 2, topic: "Sunnahs and manners of hospitality", ref: "p.452 of this book" },
    { day: 3, topic: "Sunnahs and manners of sitting", ref: "p.429 of this book" },
  ],
};

// ─── MONTHLY DUA SCHEDULE (3-day Qafilah, 12 Islamic months) ─────────────────
const MONTHLY_DUAS = {
  "Muharram-ul-Haraam": [
    { day: 1, dua: "Du'a when looking at a funeral", page: 343 },
    { day: 2, dua: "Du'a when entering the graveyard", page: 343 },
    { day: 3, dua: "Du'a when putting soil onto the grave", page: 343 },
  ],
  "Safar-ul-Muzaffar": [
    { day: 1, dua: "Du'a for entering the toilet", page: 343 },
    { day: 2, dua: "Du'a after exiting the toilet", page: 344 },
    { day: 3, dua: "An act for protection from Satan", page: 344 },
  ],
  "Rabi-ul-Awwal": [
    { day: 1, dua: "Du'a when putting on clothing", page: 344 },
    { day: 2, dua: "Du'a when applying kohl", page: 345 },
    { day: 3, dua: "Du'a upon seeing a Muslim smiling", page: 345 },
  ],
  "Rabi-ul-Aakhir": [
    { day: 1, dua: "Du'a for the one offering 'Itr (fragrance)", page: 345 },
    { day: 2, dua: "Third holy Kalimah", page: 355 },
    { day: 3, dua: "Iman-e-Mufassal", page: 354 },
  ],
  "Jumadal Awwal": [
    { day: 1, dua: "Du'a when drinking Zamzam water", page: 345 },
    { day: 2, dua: "Du'a when entering the Masjid", page: 345 },
    { day: 3, dua: "Du'a when leaving the Masjid", page: 346 },
  ],
  "Jumadal Aakhir": [
    { day: 1, dua: "Du'a at the end of a Majlis (gathering)", page: 346 },
    { day: 2, dua: "Du'a when entering the marketplace", page: 346 },
    { day: 3, dua: "Du'a to earn profit and prevent loss in the market", page: 347 },
  ],
  "Rajab-ul-Murajjab": [
    { day: 1, dua: "Du'a when someone feeds you", page: 348 },
    { day: 2, dua: "Du'a when looking in a mirror", page: 348 },
    { day: 3, dua: "Du'a for the one who replies to a sneeze", page: 349 },
  ],
  "Sha'ban-ul-Mu'azzam": [
    { day: 1, dua: "Du'a for paying off debt", page: 349 },
    { day: 2, dua: "Iman-e-Mujmal", page: 354 },
    { day: 3, dua: "Du'a to prevent from backbiting", page: 349 },
  ],
  "Ramadan-ul-Mubarak": [
    { day: 1, dua: "Du'a before eating", page: 347 },
    { day: 2, dua: "Du'a after eating", page: 348 },
    { day: 3, dua: "Du'a after drinking milk", page: 350 },
  ],
  "Shawwal-ul-Mukarram": [
    { day: 1, dua: "Du'a for getting on a vehicle", page: 350 },
    { day: 2, dua: "Du'a when exiting home", page: 351 },
    { day: 3, dua: "Du'a when entering the home", page: 350 },
  ],
  "Zul-Qa'da-til-Haraam": [
    { day: 1, dua: "Du'a before sleeping", page: 351 },
    { day: 2, dua: "Du'a after waking up from sleep", page: 351 },
    { day: 3, dua: "Du'a when visiting an ailing person", page: 352 },
  ],
  "Zul-Hijja-til-Haraam": [
    { day: 1, dua: "Du'a on a burn injury", page: 351 },
    { day: 2, dua: "Du'a for protection from snakes and scorpions", page: 352 },
    { day: 3, dua: "Du'a in extreme danger", page: 352 },
  ],
};

// ─── LAWS OF SALAH SCHEDULE (3-day monthly) ───────────────────────────────────
const MONTHLY_SALAH_LAWS = {
  "Muharram-ul-Haraam": [
    { day: 1, topic: "Method of Wudu, Faraaid of Wudu and Sunan of Wudu", ref: "Laws of Salah, pp.5-9" },
    { day: 2, topic: "Method of Ghusl and the Faraaid of Ghusl", ref: "pp.54-56" },
    { day: 3, topic: "Sunan and Faraaid of Tayammum (dry ablution) and the method of Tayammum", ref: "pp.70-72" },
  ],
  "Safar-ul-Muzaffar": [
    { day: 1, topic: "Preconditions of Salah", ref: "pp.110-115" },
    { day: 2, topic: "Faraaid and the practical method of offering Salah", ref: "pp.115-125" },
    { day: 3, topic: "9 Madani pearls about Salah of Witr, method of Sajdah Sahw, Sajdah Tilawat and Sajdah Shukr", ref: "pp.161-169" },
  ],
  "Rabi-ul-Awwal": [
    { day: 1, topic: "Funeral Salah (Fard-e-Kifayah), essentials and method of funeral Salah", ref: "pp.214-219" },
    { day: 2, topic: "Distance of Shari journey and minimum distance for becoming a Musafir", ref: "pp.174-182" },
    { day: 3, topic: "Method of ritually bathing the deceased, burial and shrouding", ref: "pp.264-268" },
  ],
  "Rabi-ul-Aakhir": [
    { day: 1, topic: "29 Acts that invalidate Salah", ref: "pp.139-145" },
    { day: 2, topic: "Practical method of offering Salah & rulings of impurities", ref: "pp.103-109, pp.21-30" },
    { day: 3, topic: "18 Madani pearls of Isal-e-Sawab and method of Fatihah", ref: "pp.276-286" },
  ],
  "Jumadal Awwal": [
    { day: 1, topic: "29 Mustahabbat and 15 Makruhaat of Wudu and ruling about used water", ref: "pp.9-13" },
    { day: 2, topic: "When to perform Ghusl, several intentions in one Ghusl, 10 rulings of reciting Quran in impurity", ref: "pp.63-70" },
    { day: 3, topic: "Sunan of Takbeer-e-Tahrimah, Qiyam and Ruku' from ~96 Sunan of Salah", ref: "pp.128-130" },
  ],
  "Jumadal Aakhir": [
    { day: 1, topic: "Rulings on Salah on a moving conveyance, Qada Salah during travel", ref: "pp.183-187" },
    { day: 2, topic: "Method of offering lifetime Qada Salah, order of offering Qada Salah", ref: "pp.197-202" },
    { day: 3, topic: "Practical method of offering Salah & Method of Purifying Clothes", ref: "pp.103-109, pp.1-11" },
  ],
  "Rajab-ul-Murajjab": [
    { day: 1, topic: "Sunan of Qawmah, Jalsah, Sajdah and standing for second Rak'at from ~96 Sunan", ref: "pp.130-132" },
    { day: 2, topic: "16 Makruhaat-e-Tahrimah of Salah", ref: "pp.145-149" },
    { day: 3, topic: "15 acts that invalidate Salah", ref: "pp.139-142" },
  ],
  "Sha'ban-ul-Mu'azzam": [
    { day: 1, topic: "15 rulings about passing across the front of a Musalli", ref: "pp.170-172" },
    { day: 2, topic: "7 Madani pearls of Friday sermon and Sunnahs of Jumu'ah", ref: "pp.240-244" },
    { day: 3, topic: "9 Madani pearls about Salah of Witr and practical method of offering Salah", ref: "pp.161, 103-109" },
  ],
  "Ramadan-ul-Mubarak": [
    { day: 1, topic: "Method of Purifying Clothes with Account of Impurities", ref: "pp.11-22" },
    { day: 2, topic: "20 Sunnah and desirable acts of Eid", ref: "pp.250-251" },
    { day: 3, topic: "Method of offering Eid Salah", ref: "pp.246-250" },
  ],
  "Shawwal-ul-Mukarram": [
    { day: 1, topic: "20 valid reasons for missing Jama'at", ref: "pp.159-160" },
    { day: 2, topic: "30 Wajibat of Salah (memorise at least 12)", ref: "pp.125-127" },
    { day: 3, topic: "Sunan of Qa'dah, performing Salam, after Salam, and Sunnat-e-Ba'diyyah", ref: "pp.132-136" },
  ],
  "Zul-Qa'da-til-Haraam": [
    { day: 1, topic: "6 rulings for those who cannot retain Wudu and 5 rulings about uncertainty in Wudu", ref: "pp.24-26, p.19" },
    { day: 2, topic: "5 rulings regarding bleeding from wound, do injections nullify Wudu, vomiting and Wudu", ref: "pp.15-17" },
    { day: 3, topic: "Practical method of offering Salah and preconditions of Salah", ref: "pp.110-115" },
  ],
  "Zul-Hijja-til-Haraam": [
    { day: 1, topic: "Method of Purifying Clothes with Account of Impurities", ref: "pp.21-33" },
    { day: 2, topic: "Salah practiced practically — Faraaid of Wudu and Ghusl", ref: "pp.103-109, p.8, pp.55-56" },
    { day: 3, topic: "8 Madani pearls of Takbeer-e-Tashreeq and method of offering Eid Salah", ref: "pp.252-253, pp.246-247" },
  ],
};

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
const SCHEDULE = [
  { id: "tahajjud", time: "Pre-Fajr", label: "Tahajjud & Preparation", icon: "🌙", activities: [
    { time: "19 min before Subh-e-Sadiq", task: "Wake up & offer Salat-ut-Tahajjud", type: "salah" },
    { time: "Before Fajr Azan", task: "Brothers going to nearby Masajid for Dars should leave", type: "travel" },
    { time: "After Fajr Azan", task: "Call out Sada-e-Madinah (wake-up call for Fajr)", type: "action" },
  ]},
  { id: "fajr", time: "Fajr", label: "Fajr Salah & Halqah", icon: "🕌", activities: [
    { time: "After Fajr Salah", task: "Bayan (7–12 min): Zikrullah / Bismillah / Quran / Salat-Alan-Nabi", type: "bayan" },
    { time: "Fajr Halqah", task: "Quran recitation with translation & commentary (Madani In'aam no. 21)", type: "learning" },
    { time: "Fajr Halqah", task: "Study Faizan-e-Sunnat passage", type: "learning" },
    { time: "Fajr Halqah", task: "Revision of previously learned Sunnahs & Du'as", type: "learning" },
  ]},
  { id: "morning", time: "9:30 AM", label: "Morning Sessions", icon: "☀️", activities: [
    { time: "9:30–9:56 AM", task: "Mashwarah (26 min): 5 min Quran & Na'at, then schedule revision & In'amaat booklet distribution", type: "admin" },
    { time: "9:56–10:37 AM", task: "Bayan on Madani Mission (41 min): 26 min speech + 15 min mindset on 12 Madani tasks", type: "bayan" },
    { time: "10:37–10:56 AM", task: "Individual Worship (19 min): Quran, Zikr, Salat-Alan-Nabi, study In'amaat schedule", type: "ibadah" },
    { time: "10:56–11:08 AM", task: "Memorise short invitation towards righteousness (12 min)", type: "learning" },
    { time: "11:08–11:20 AM", task: "Method of Individual Effort (12 min) — Ameer demonstrates practically", type: "learning" },
    { time: "11:20 AM–12:00 PM", task: "Individual Effort (40 min): Go out to invite people to Masjid", type: "action" },
  ]},
  { id: "zuhr", time: "Zuhr", label: "Zuhr & Afternoon", icon: "🌤️", activities: [
    { time: "12:00–12:30 PM", task: "Sunnah learning session (see Sunnahs tab for this month's topics)", type: "learning" },
    { time: "12 min before Zuhr Azan", task: "Chowk Dars (7 min) from Faizan-e-Sunnat at the square", type: "action" },
    { time: "After Zuhr Salah", task: "Madani Dars (7 min) from Faizan-e-Sunnat", type: "dars" },
    { time: "After Zuhr Dars", task: "Laws of Salah session (30 min) — see Sunnahs tab for this month's topics", type: "learning" },
    { time: "Afternoon", task: "Method of delivering Madani Dars & Bayan (19 min)", type: "learning" },
    { time: "Summer: now / Winter: after Isha", task: "Memorising Du'as session (19 min) — see Du'as tab for this month's topics", type: "learning" },
    { time: "Rest Break", task: "Rest until Asr Salah", type: "rest" },
  ]},
  { id: "asr", time: "Asr", label: "Asr & Madani Visit", icon: "🕌", activities: [
    { time: "After Asr Salah", task: "Announcement & Bayan (12 min): Virtues of calling towards righteousness", type: "bayan" },
    { time: "After Asr Bayan", task: "Madani Visit (door-to-door invitation)", type: "action" },
    { time: "Between Asr & Maghrib", task: "Madani Dars from Faizan-e-Sunnat & Bayanaat-e-Attariyyah + Sunnah revision", type: "dars" },
  ]},
  { id: "maghrib", time: "Maghrib", label: "Maghrib Bayan & Dinner", icon: "🌆", activities: [
    { time: "After Maghrib Salah", task: "Bayan by efficient Muballigh (topic varies by day — see Schedule tab)", type: "bayan" },
    { time: "After Bayan", task: "Individual effort for 12 minutes", type: "action" },
    { time: "Between Maghrib & Isha", task: "Dinner", type: "rest" },
  ]},
  { id: "isha", time: "Isha", label: "Isha & Night Session", icon: "🌃", activities: [
    { time: "After Isha Salah", task: "Madani Dars (7 min) from Faizan-e-Sunnat", type: "dars" },
    { time: "After Dars", task: "7 min Individual effort, then Cassette/CD Bayan (or read booklet aloud)", type: "bayan" },
    { time: "Winter only", task: "Memorising Du'as session (19 min) — in summer held at midday", type: "learning" },
    { time: "Night", task: "Revision: Ameer revises day's learning; volunteers recite", type: "learning" },
    { time: "Before Sleep", task: "Collective Fikr-e-Madinah, Salat-ut-Taubah, listen to Surah Al-Mulk", type: "ibadah" },
  ]},
];

const typeColors = {
  salah: "#2d4a6b", bayan: "#6b2d4a", learning: "#2d6b4a",
  action: "#6b4a1a", ibadah: "#1a406b", dars: "#4a1a6b",
  rest: "#333", travel: "#1a5a4a", admin: "#445",
};
const typeLabels = {
  salah: "Salah", bayan: "Bayan", learning: "Learning",
  action: "Individual Effort", ibadah: "Ibadah", dars: "Dars",
  rest: "Rest", travel: "Journey", admin: "Mashwarah",
};

const DAY_GUIDES = {
  3: [
    { day: 1, maghrib: "Importance of travelling in the path of Allah & virtues of intentions" },
    { day: 2, maghrib: "Persuade participants to present names for the next Qafilah — record them" },
    { day: 3, maghrib: "Sacrifices of pious predecessors & motivation for next Qafilah. Also: Bayan after Maghrib and Dars after Isha" },
  ],
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("schedule");
  const [qafilaType, setQafilaType] = useState(3);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(ISLAMIC_MONTHS[0]);
  const [expandedSession, setExpandedSession] = useState("fajr");
  const [checkedItems, setCheckedItems] = useState({});
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const toggleCheck = (sessionId, idx) => {
    const key = `${sessionId}-${idx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const todayGuide = DAY_GUIDES[3]?.find(d => d.day === Math.min(currentDay, 3));
  const monthSunnahs = MONTHLY_SUNNAHS[selectedMonth] || [];
  const monthDuas = MONTHLY_DUAS[selectedMonth] || [];
  const monthSalahLaws = MONTHLY_SALAH_LAWS[selectedMonth] || [];
  const todaySunnahs = qafilaType === 3 ? monthSunnahs.filter(s => s.day === currentDay) : monthSunnahs;
  const todayDuas = qafilaType === 3 ? monthDuas.filter(d => d.day === currentDay) : monthDuas;
  const todaySalahLaws = qafilaType === 3 ? monthSalahLaws.filter(s => s.day === currentDay) : monthSalahLaws;

  const total = SCHEDULE.reduce((s, sess) => s + sess.activities.length, 0);
  const done = Object.values(checkedItems).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

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
          <div style={{ display: "flex", marginTop: 10 }}>
            {[["schedule","📋 Schedule"],["sunnahs","📿 Sunnahs"],["duas","🤲 Du'as"],["salah","🙏 Salah Laws"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex: 1, padding: "9px 2px", border: "none",
                  borderBottom: tab === id ? "2px solid #d4af7a" : "2px solid transparent",
                  background: "transparent", color: tab === id ? "#d4af7a" : "#8899aa",
                  cursor: "pointer", fontSize: 10, fontWeight: tab === id ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 14 }} onClick={() => showMonthPicker && setShowMonthPicker(false)}>

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
              const completedCount = session.activities.filter((_, i) => checkedItems[`${session.id}-${i}`]).length;
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
                        const key = `${session.id}-${i}`;
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#d4af7a", fontWeight: 600 }}>{done} of {total} activities</span>
                <span style={{ fontSize: 12, color: "#7fd4a0" }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: "#1e2030", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#2d6b4a,#7fd4a0)", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              {done > 0 && (
                <button onClick={() => setCheckedItems({})} style={{ marginTop: 8, fontSize: 10, color: "#556", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Reset checklist
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
              {(qafilaType === 3 ? todaySunnahs : monthSunnahs).map((s, i) => (
                <div key={i} style={{ background: "#141420", borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid #2a3a3a", borderLeft: "3px solid #2d6b4a" }}>
                  {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#5a9a6a", marginBottom: 4 }}>Day {s.day}</div>}
                  <div style={{ fontSize: 13, color: "#c8d0dc", fontWeight: 500, marginBottom: 4 }}>{s.topic}</div>
                  <div style={{ fontSize: 10, color: "#4a6a5a", background: "#0d1f14", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>📖 {s.ref}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🙏 Laws of Salah (30 min)</div>
              {(qafilaType === 3 ? todaySalahLaws : monthSalahLaws).map((s, i) => (
                <div key={i} style={{ background: "#141420", borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid #2a2a4a", borderLeft: "3px solid #2d4a6b" }}>
                  {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#5a7aaa", marginBottom: 4 }}>Day {s.day}</div>}
                  <div style={{ fontSize: 13, color: "#c8d0dc", fontWeight: 500, marginBottom: 4 }}>{s.topic}</div>
                  <div style={{ fontSize: 10, color: "#4a5a7a", background: "#0d1420", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>📖 {s.ref}</div>
                </div>
              ))}
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

            {(qafilaType === 3 ? todayDuas : monthDuas).map((d, i) => (
              <div key={i} style={{ background: "#141420", borderRadius: 12, padding: "14px", marginBottom: 10, border: "1px solid #2a2a4a", borderLeft: "3px solid #6b2d4a" }}>
                {qafilaType !== 3 && <div style={{ fontSize: 10, color: "#aa5a7a", marginBottom: 4 }}>Day {d.day}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#d4c0e0", fontWeight: 600, marginBottom: 6 }}>{d.dua}</div>
                    <div style={{ fontSize: 10, color: "#6a4a6a", background: "#1a0d20", borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>
                      📖 Path to Piety, page {d.page}
                    </div>
                  </div>
                  <span style={{ fontSize: 22, opacity: 0.5, marginLeft: 8 }}>🤲</span>
                </div>
              </div>
            ))}

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

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 10, color: "#334", lineHeight: 1.7 }}>
          Based on "Path to Piety" (Nayk Bannay aur Bananay kay Tareeqay)<br />
          Majlis Madani Qafilah & Al-Madina-tul-'Ilmiyyah · Dawat-e-Islami
        </div>
      </div>
    </div>
  );
}
