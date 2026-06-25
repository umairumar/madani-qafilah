export const DUTIES = [
  {
    id: "awaken-brothers",
    label: "Awakening the Islamic brothers from sleep",
  },
  {
    id: "masajid-fajr-zuhr",
    label: "The duty to visit different Masajid for Fajr and Zuhr Salah",
  },
  {
    id: "chowk-dars",
    label: "Delivering Chowk Dars",
  },
  {
    id: "fajr-announcement",
    label: "Making the announcement after Fajr Salah",
  },
  {
    id: "fajr-bayan",
    label: "Delivering the Bayan after Fajr Salah",
  },
  {
    id: "zuhr-dars",
    label: "Delivering Dars after Zuhr Salah",
  },
  {
    id: "asr-announcement",
    label: "Making the announcement after 'Asr Salah",
  },
  {
    id: "asr-bayan-12min",
    label: "Delivering a 12-minute Bayan after 'Asr Salah",
  },
  {
    id: "asr-to-maghrib-dars",
    label: "Delivering Dars from 'Asr to Maghrib Salah",
  },
  {
    id: "righteousness-outside",
    label: "Calling people towards righteousness by going outside the Masjid",
  },
  {
    id: "madani-visit-ameer",
    label: "Acting as the Ameer for performing the Madani visit",
  },
  {
    id: "maghrib-announcement",
    label: "Making the announcement after Maghrib Salah",
  },
  {
    id: "maghrib-bayan",
    label: "Delivering the Bayan after Maghrib Salah",
  },
  {
    id: "isha-dars",
    label: "Delivering Dars after 'Isha Salah",
  },
  {
    id: "isha-cassette-dars",
    label: "Managing the Cassette/VCD/DVD Bayan after 'Isha Salah or delivering Dars from Rasaail-e-'Attariyyah",
  },
  {
    id: "food-service",
    label: "The duty of serving food",
    note: "Typically assigned to two Islamic brothers",
    minBrothers: 2,
  },
  {
    id: "masjid-care",
    label: "Taking care of the Masjid — lights, fans, carpets, and other items",
  },
  {
    id: "request-stay-dars",
    label: "Requesting Salah-offering Islamic brothers to stay during the Dars and Bayan",
  },
];

export function getDutyById(id) {
  return DUTIES.find((d) => d.id === id);
}
