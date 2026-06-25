export const STORAGE_KEYS = {
  JOURNEY: "qf_journey",
  BROTHERS: "qf_brothers",
  EXPENSES: "qf_expenses",
  NAME: "qf_name",
  CHECKLIST: "qf_checklist",
  SUNNAHS_DONE: "qf_sunnahs_done",
  DUAS_DONE: "qf_duas_done",
  SALAH_DONE: "qf_salah_done",
};

export const DEFAULT_JOURNEY = {
  fromCity: "",
  toCity: "",
  venueName: "",
  venueAddress: "",
  startDate: "",
  endDate: "",
};

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export function monthDayKey(month, day) {
  return `${month}-${day}`;
}
