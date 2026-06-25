import { useState, useEffect } from "react";
import { DUTIES, getDutyById } from "./dutiesData";
import { STORAGE_KEYS, load, RESET_EVENT } from "./storage";

const selectStyle = {
  width: "100%",
  background: "#141420",
  border: "1px solid #2a2a3a",
  borderRadius: 8,
  padding: "8px 12px",
  color: "#e6e6e6",
  fontSize: 12,
  boxSizing: "border-box",
};

export default function DutiesTab({ currentDay, qafilaType, brothers, duties, setDuties }) {
  const [selectedDuty, setSelectedDuty] = useState(DUTIES[0]?.id || "");
  const [selectedBrother, setSelectedBrother] = useState("");

  useEffect(() => {
    const onReset = () => setDuties(load(STORAGE_KEYS.DUTIES, {}));
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, [setDuties]);

  useEffect(() => {
    if (brothers.length && !brothers.includes(selectedBrother)) {
      setSelectedBrother(brothers[0]);
    } else if (!brothers.length) {
      setSelectedBrother("");
    }
  }, [brothers, selectedBrother]);

  const dayKey = String(currentDay);
  const dayAssignments = duties[dayKey] || {};

  const assignBrother = () => {
    if (!selectedDuty || !selectedBrother) return;
    setDuties((prev) => {
      const day = { ...(prev[dayKey] || {}) };
      const existing = day[selectedDuty] || [];
      if (existing.includes(selectedBrother)) return prev;
      day[selectedDuty] = [...existing, selectedBrother];
      return { ...prev, [dayKey]: day };
    });
  };

  const removeBrother = (dutyId, brother) => {
    setDuties((prev) => {
      const day = { ...(prev[dayKey] || {}) };
      const next = (day[dutyId] || []).filter((b) => b !== brother);
      if (next.length) {
        day[dutyId] = next;
      } else {
        delete day[dutyId];
      }
      const updated = { ...prev };
      if (Object.keys(day).length) {
        updated[dayKey] = day;
      } else {
        delete updated[dayKey];
      }
      return updated;
    });
  };

  const removeAllForDuty = (dutyId) => {
    setDuties((prev) => {
      const day = { ...(prev[dayKey] || {}) };
      delete day[dutyId];
      const updated = { ...prev };
      if (Object.keys(day).length) {
        updated[dayKey] = day;
      } else {
        delete updated[dayKey];
      }
      return updated;
    });
  };

  const assignedDutyIds = Object.keys(dayAssignments);
  const unassignedDuties = DUTIES.filter((d) => !assignedDutyIds.includes(d.id));
  const assignedCount = assignedDutyIds.length;

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#1a2030,#0d1a30)",
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 14,
          border: "1px solid #2a3a4a",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>📌 Daily Duties</div>
        <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 6 }}>
          Assign Qafilah responsibilities to brothers for each day. Use the day selector in the header to switch days.
        </div>
        <div style={{ fontSize: 11, color: "#c8d0dc" }}>
          Day <strong style={{ color: "#d4af7a" }}>{currentDay}</strong> of {qafilaType}
          {" · "}
          <span style={{ color: assignedCount === DUTIES.length ? "#7fd4a0" : "#8899aa" }}>
            {assignedCount} of {DUTIES.length} duties assigned
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#141420",
          borderRadius: 12,
          padding: "14px",
          marginBottom: 14,
          border: "1px solid #2a2a3a",
        }}
      >
        <div style={{ fontSize: 10, color: "#6677aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          Assign duty
        </div>

        {brothers.length === 0 ? (
          <div style={{ fontSize: 12, color: "#8899aa", lineHeight: 1.5 }}>
            Add brothers in the <strong style={{ color: "#d4af7a" }}>Expenses</strong> tab first, then return here to assign duties.
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Duty</div>
                <select value={selectedDuty} onChange={(e) => setSelectedDuty(e.target.value)} style={selectStyle}>
                  {DUTIES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Brother</div>
                <select value={selectedBrother} onChange={(e) => setSelectedBrother(e.target.value)} style={selectStyle}>
                  {brothers.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={assignBrother}
              disabled={!selectedDuty || !selectedBrother}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: selectedDuty && selectedBrother ? "#2d4a3a" : "#1e2030",
                color: selectedDuty && selectedBrother ? "#7fd4a0" : "#556",
                fontSize: 12,
                fontWeight: 600,
                cursor: selectedDuty && selectedBrother ? "pointer" : "default",
              }}
            >
              Assign brother to duty
            </button>
          </>
        )}
      </div>

      {assignedDutyIds.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "#6677aa",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Today's assignments
          </div>
          {assignedDutyIds.map((dutyId) => {
            const duty = getDutyById(dutyId);
            const assignedBrothers = dayAssignments[dutyId] || [];
            if (!duty) return null;
            const needsMore =
              duty.minBrothers && assignedBrothers.length < duty.minBrothers
                ? duty.minBrothers - assignedBrothers.length
                : 0;

            return (
              <div
                key={dutyId}
                style={{
                  background: "#141420",
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 8,
                  border: "1px solid #2a2a3a",
                  borderLeft: "3px solid #d4af7a",
                }}
              >
                <div style={{ fontSize: 12, color: "#c8d0dc", fontWeight: 500, marginBottom: 4, lineHeight: 1.5 }}>
                  {duty.label}
                </div>
                {duty.note && (
                  <div style={{ fontSize: 10, color: "#8899aa", marginBottom: 8 }}>{duty.note}</div>
                )}
                {needsMore > 0 && (
                  <div style={{ fontSize: 10, color: "#c4a060", marginBottom: 8 }}>
                    {needsMore} more brother{needsMore > 1 ? "s" : ""} needed
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {assignedBrothers.map((b) => (
                    <span
                      key={b}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#1a2a3a",
                        border: "1px solid #2a3a4a",
                        borderRadius: 16,
                        padding: "4px 10px",
                        fontSize: 11,
                        color: "#c8d0dc",
                      }}
                    >
                      {b}
                      <button
                        type="button"
                        onClick={() => removeBrother(dutyId, b)}
                        aria-label={`Remove ${b}`}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#8899aa",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: 14,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => removeAllForDuty(dutyId)}
                  style={{
                    fontSize: 10,
                    color: "#556",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Remove all for this duty
                </button>
              </div>
            );
          })}
        </div>
      )}

      {unassignedDuties.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#6677aa",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Unassigned duties
          </div>
          {unassignedDuties.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "8px 0",
                borderBottom: "1px solid #1e2030",
              }}
            >
              <span style={{ color: "#4a5a6a", fontSize: 12, flexShrink: 0 }}>○</span>
              <span style={{ fontSize: 11, color: "#8899aa", lineHeight: 1.5 }}>{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
