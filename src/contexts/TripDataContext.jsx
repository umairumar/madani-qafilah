import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ISLAMIC_MONTHS } from "../qafilahData";
import { STORAGE_KEYS, DEFAULT_JOURNEY, load, save, RESET_EVENT } from "../storage";
import { useGroup } from "./GroupContext";
import { buildPersistPayload, createEmptyTripState, normalizeTripState } from "../lib/groupState";

const TripDataContext = createContext(null);

function loadSoloState() {
  return {
    journey: { ...DEFAULT_JOURNEY, ...load(STORAGE_KEYS.JOURNEY, {}) },
    brothers: load(STORAGE_KEYS.BROTHERS, []),
    expenses: load(STORAGE_KEYS.EXPENSES, []),
    checkedItems: load(STORAGE_KEYS.CHECKLIST, {}),
    sunnahsDone: load(STORAGE_KEYS.SUNNAHS_DONE, {}),
    duasDone: load(STORAGE_KEYS.DUAS_DONE, {}),
    salahDone: load(STORAGE_KEYS.SALAH_DONE, {}),
    duties: load(STORAGE_KEYS.DUTIES, {}),
    qafilaType: 3,
    selectedMonth: ISLAMIC_MONTHS[0],
  };
}

export function TripDataProvider({ children }) {
  const {
    isGroupMode,
    groupTripState,
    setGroupTripState,
    persistGroupState,
    members,
  } = useGroup();

  const [journey, setJourney] = useState(() => loadSoloState().journey);
  const [brothers, setBrothers] = useState(() => loadSoloState().brothers);
  const [expenses, setExpenses] = useState(() => loadSoloState().expenses);
  const [checkedItems, setCheckedItems] = useState(() => loadSoloState().checkedItems);
  const [sunnahsDone, setSunnahsDone] = useState(() => loadSoloState().sunnahsDone);
  const [duasDone, setDuasDone] = useState(() => loadSoloState().duasDone);
  const [salahDone, setSalahDone] = useState(() => loadSoloState().salahDone);
  const [duties, setDuties] = useState(() => loadSoloState().duties);
  const [qafilaType, setQafilaType] = useState(3);
  const [selectedMonth, setSelectedMonth] = useState(ISLAMIC_MONTHS[0]);
  const hydrating = useRef(false);

  const applyTripState = useCallback((state) => {
    const normalized = normalizeTripState(state);
    hydrating.current = true;
    setJourney(normalized.journey);
    setBrothers(normalized.brothers);
    setExpenses(normalized.expenses);
    setCheckedItems(normalized.checklist);
    setSunnahsDone(normalized.sunnahsDone);
    setDuasDone(normalized.duasDone);
    setSalahDone(normalized.salahDone);
    setDuties(normalized.duties);
    setQafilaType(normalized.qafilaType);
    setSelectedMonth(normalized.selectedMonth);
    setTimeout(() => { hydrating.current = false; }, 0);
  }, []);

  useEffect(() => {
    if (isGroupMode && groupTripState) {
      applyTripState(groupTripState);
    }
  }, [isGroupMode, groupTripState, applyTripState]);

  useEffect(() => {
    if (isGroupMode && members.length) {
      setBrothers(members.map((m) => m.displayName));
    }
  }, [isGroupMode, members]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.JOURNEY, journey);
  }, [journey, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.BROTHERS, brothers);
  }, [brothers, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.CHECKLIST, checkedItems);
  }, [checkedItems, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.SUNNAHS_DONE, sunnahsDone);
  }, [sunnahsDone, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.DUAS_DONE, duasDone);
  }, [duasDone, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.SALAH_DONE, salahDone);
  }, [salahDone, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || isGroupMode) return;
    save(STORAGE_KEYS.DUTIES, duties);
  }, [duties, isGroupMode]);

  useEffect(() => {
    if (hydrating.current || !isGroupMode) return;
    const payload = buildPersistPayload({
      journey,
      brothers,
      expenses,
      checkedItems,
      sunnahsDone,
      duasDone,
      salahDone,
      duties,
      qafilaType,
      selectedMonth,
    });
    setGroupTripState(payload);
    persistGroupState(payload);
  }, [
    journey,
    brothers,
    expenses,
    checkedItems,
    sunnahsDone,
    duasDone,
    salahDone,
    duties,
    qafilaType,
    selectedMonth,
    isGroupMode,
    persistGroupState,
    setGroupTripState,
  ]);

  const resetSoloTrip = useCallback(() => {
    const empty = createEmptyTripState();
    applyTripState(empty);
  }, [applyTripState]);

  useEffect(() => {
    const onReset = () => {
      if (!isGroupMode) applyTripState(loadSoloState());
    };
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, [isGroupMode, applyTripState]);

  return (
    <TripDataContext.Provider
      value={{
        journey,
        setJourney,
        brothers,
        setBrothers,
        expenses,
        setExpenses,
        checkedItems,
        setCheckedItems,
        sunnahsDone,
        setSunnahsDone,
        duasDone,
        setDuasDone,
        salahDone,
        setSalahDone,
        duties,
        setDuties,
        qafilaType,
        setQafilaType,
        selectedMonth,
        setSelectedMonth,
        resetSoloTrip,
        brothersReadOnly: isGroupMode,
      }}
    >
      {children}
    </TripDataContext.Provider>
  );
}

export function useTripData() {
  const ctx = useContext(TripDataContext);
  if (!ctx) throw new Error("useTripData must be used within TripDataProvider");
  return ctx;
}
