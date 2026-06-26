# 🕌 Madani Qafilah Companion

A mobile-first companion app for travellers of **Madani Qafilah** (Dawat-e-Islami), based on the book **"Path to Piety"** (Nayk Bannay aur Bananay kay Tareeqay).

## Features

- 📋 **Full Daily Schedule** — Time-anchored programme from Tahajjud to Isha with activity checklist
- 🎤 **Bayanaat Guide** — All 9 Fajr, 9 Asr, and 11 Maghrib speeches with page references
- 🤲 **Du'as** — Arabic text, Urdu, translation and notes for Qafilah duas
- 📿 **Sunnahs** — Progressive Sunnah learning sequences for 3-day, 12-day, 30-day Qafilahs
- 📅 **Day-by-Day Guide** — Tailored Maghrib topics per day
- ✅ **Daily Progress Tracker** — Check off activities as you complete them

## Qafilah Types Supported
- 3-Day Qafilah
- 12-Day Qafilah  
- 30-Day Qafilah

## Source
Based on *Path to Piety* published by Maktaba-tul-Madinah, Dawat-e-Islami (2017).  
www.dawateislami.net

## Tech Stack
- React + Vite
- Supabase (Gather Ummah auth + Qafilah groups)
- Deployed on Vercel

## Gather Ummah integration

Qafilah groups use the same Supabase project as [Gather Ummah](https://gatherummah.com). Sign in with the same email to join private per-event groups, sync journey/expenses/schedule with your brothers, and RSVP from the Upcoming tab.

**Supabase Auth redirect URLs** (one-time dashboard setup):

- `https://qafilah.app`
- `http://localhost:5173`

Copy `.env.example` to `.env` if you need to override the default public Supabase credentials.

## Getting Started

```bash
npm install
npm run dev
```
