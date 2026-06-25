export const ISLAMIC_MONTHS = [
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

// â”€â”€â”€ MONTHLY SUNNAH SCHEDULE (3-day Qafilah, 12 Islamic months) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const MONTHLY_SUNNAHS = {
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

// â”€â”€â”€ MONTHLY DUA SCHEDULE (3-day Qafilah, 12 Islamic months) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const MONTHLY_DUAS = {
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

// â”€â”€â”€ LAWS OF SALAH SCHEDULE (3-day monthly) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const MONTHLY_SALAH_LAWS = {
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
    { day: 2, topic: "Salah practiced practically â€” Faraaid of Wudu and Ghusl", ref: "pp.103-109, p.8, pp.55-56" },
    { day: 3, topic: "8 Madani pearls of Takbeer-e-Tashreeq and method of offering Eid Salah", ref: "pp.252-253, pp.246-247" },
  ],
};

// â”€â”€â”€ SCHEDULE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const SCHEDULE = [
  { id: "tahajjud", time: "Pre-Fajr", label: "Tahajjud & Preparation", icon: "ðŸŒ™", activities: [
    { time: "19 min before Subh-e-Sadiq", task: "Wake up & offer Salat-ut-Tahajjud", type: "salah" },
    { time: "Before Fajr Azan", task: "Brothers going to nearby Masajid for Dars should leave", type: "travel" },
    { time: "After Fajr Azan", task: "Call out Sada-e-Madinah (wake-up call for Fajr)", type: "action" },
  ]},
  { id: "fajr", time: "Fajr", label: "Fajr Salah & Halqah", icon: "ðŸ•Œ", activities: [
    { time: "After Fajr Salah", task: "Bayan (7â€“12 min): Zikrullah / Bismillah / Quran / Salat-Alan-Nabi", type: "bayan" },
    { time: "Fajr Halqah", task: "Quran recitation with translation & commentary (Madani In'aam no. 21)", type: "learning" },
    { time: "Fajr Halqah", task: "Study Faizan-e-Sunnat passage", type: "learning" },
    { time: "Fajr Halqah", task: "Revision of previously learned Sunnahs & Du'as", type: "learning" },
  ]},
  { id: "morning", time: "9:30 AM", label: "Morning Sessions", icon: "â˜€ï¸", activities: [
    { time: "9:30â€“9:56 AM", task: "Mashwarah (26 min): 5 min Quran & Na'at, then schedule revision & In'amaat booklet distribution", type: "admin" },
    { time: "9:56â€“10:37 AM", task: "Bayan on Madani Mission (41 min): 26 min speech + 15 min mindset on 12 Madani tasks", type: "bayan" },
    { time: "10:37â€“10:56 AM", task: "Individual Worship (19 min): Quran, Zikr, Salat-Alan-Nabi, study In'amaat schedule", type: "ibadah" },
    { time: "10:56â€“11:08 AM", task: "Memorise short invitation towards righteousness (12 min)", type: "learning" },
    { time: "11:08â€“11:20 AM", task: "Method of Individual Effort (12 min) â€” Ameer demonstrates practically", type: "learning" },
    { time: "11:20 AMâ€“12:00 PM", task: "Individual Effort (40 min): Go out to invite people to Masjid", type: "action" },
  ]},
  { id: "zuhr", time: "Zuhr", label: "Zuhr & Afternoon", icon: "ðŸŒ¤ï¸", activities: [
    { time: "12:00â€“12:30 PM", task: "Sunnah learning session (see Sunnahs tab for this month's topics)", type: "learning" },
    { time: "12 min before Zuhr Azan", task: "Chowk Dars (7 min) from Faizan-e-Sunnat at the square", type: "action" },
    { time: "After Zuhr Salah", task: "Madani Dars (7 min) from Faizan-e-Sunnat", type: "dars" },
    { time: "After Zuhr Dars", task: "Laws of Salah session (30 min) â€” see Sunnahs tab for this month's topics", type: "learning" },
    { time: "Afternoon", task: "Method of delivering Madani Dars & Bayan (19 min)", type: "learning" },
    { time: "Summer: now / Winter: after Isha", task: "Memorising Du'as session (19 min) â€” see Du'as tab for this month's topics", type: "learning" },
    { time: "Rest Break", task: "Rest until Asr Salah", type: "rest" },
  ]},
  { id: "asr", time: "Asr", label: "Asr & Madani Visit", icon: "ðŸ•Œ", activities: [
    { time: "After Asr Salah", task: "Announcement & Bayan (12 min): Virtues of calling towards righteousness", type: "bayan" },
    { time: "After Asr Bayan", task: "Madani Visit (door-to-door invitation)", type: "action" },
    { time: "Between Asr & Maghrib", task: "Madani Dars from Faizan-e-Sunnat & Bayanaat-e-Attariyyah + Sunnah revision", type: "dars" },
  ]},
  { id: "maghrib", time: "Maghrib", label: "Maghrib Bayan & Dinner", icon: "ðŸŒ†", activities: [
    { time: "After Maghrib Salah", task: "Bayan by efficient Muballigh (topic varies by day â€” see Schedule tab)", type: "bayan" },
    { time: "After Bayan", task: "Individual effort for 12 minutes", type: "action" },
    { time: "Between Maghrib & Isha", task: "Dinner", type: "rest" },
  ]},
  { id: "isha", time: "Isha", label: "Isha & Night Session", icon: "ðŸŒƒ", activities: [
    { time: "After Isha Salah", task: "Madani Dars (7 min) from Faizan-e-Sunnat", type: "dars" },
    { time: "After Dars", task: "7 min Individual effort, then Cassette/CD Bayan (or read booklet aloud)", type: "bayan" },
    { time: "Winter only", task: "Memorising Du'as session (19 min) â€” in summer held at midday", type: "learning" },
    { time: "Night", task: "Revision: Ameer revises day's learning; volunteers recite", type: "learning" },
    { time: "Before Sleep", task: "Collective Fikr-e-Madinah, Salat-ut-Taubah, listen to Surah Al-Mulk", type: "ibadah" },
  ]},
];

export const typeColors = {
  salah: "#2d4a6b", bayan: "#6b2d4a", learning: "#2d6b4a",
  action: "#6b4a1a", ibadah: "#1a406b", dars: "#4a1a6b",
  rest: "#333", travel: "#1a5a4a", admin: "#445",
};
export const typeLabels = {
  salah: "Salah", bayan: "Bayan", learning: "Learning",
  action: "Individual Effort", ibadah: "Ibadah", dars: "Dars",
  rest: "Rest", travel: "Journey", admin: "Mashwarah",
};

export const DAY_GUIDES = {
  3: [
    { day: 1, maghrib: "Importance of travelling in the path of Allah & virtues of intentions" },
    { day: 2, maghrib: "Persuade participants to present names for the next Qafilah â€” record them" },
    { day: 3, maghrib: "Sacrifices of pious predecessors & motivation for next Qafilah. Also: Bayan after Maghrib and Dars after Isha" },
  ],
};
