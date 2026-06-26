import { DEFAULT_JOURNEY } from "../storage";
import { ISLAMIC_MONTHS } from "../qafilahData";

export function createEmptyTripState() {
  return {
    journey: { ...DEFAULT_JOURNEY },
    brothers: [],
    expenses: [],
    checklist: {},
    sunnahsDone: {},
    duasDone: {},
    salahDone: {},
    duties: {},
    qafilaType: 3,
    selectedMonth: ISLAMIC_MONTHS[0],
  };
}

export function normalizeTripState(raw) {
  const base = createEmptyTripState();
  if (!raw || typeof raw !== "object") return base;
  return {
    journey: { ...base.journey, ...(raw.journey || {}) },
    brothers: Array.isArray(raw.brothers) ? raw.brothers : base.brothers,
    expenses: Array.isArray(raw.expenses) ? raw.expenses : base.expenses,
    checklist: raw.checklist && typeof raw.checklist === "object" ? raw.checklist : base.checklist,
    sunnahsDone: raw.sunnahsDone && typeof raw.sunnahsDone === "object" ? raw.sunnahsDone : base.sunnahsDone,
    duasDone: raw.duasDone && typeof raw.duasDone === "object" ? raw.duasDone : base.duasDone,
    salahDone: raw.salahDone && typeof raw.salahDone === "object" ? raw.salahDone : base.salahDone,
    duties: raw.duties && typeof raw.duties === "object" ? raw.duties : base.duties,
    qafilaType: raw.qafilaType || base.qafilaType,
    selectedMonth: raw.selectedMonth || base.selectedMonth,
  };
}

export function buildPersistPayload(state) {
  return {
    journey: state.journey,
    brothers: state.brothers,
    expenses: state.expenses,
    checklist: state.checkedItems ?? state.checklist,
    sunnahsDone: state.sunnahsDone,
    duasDone: state.duasDone,
    salahDone: state.salahDone,
    duties: state.duties,
    qafilaType: state.qafilaType,
    selectedMonth: state.selectedMonth,
  };
}
