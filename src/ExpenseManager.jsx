import { useState, useEffect } from "react";
import { STORAGE_KEYS, load, save, clearExpensesOnly, RESET_EVENT } from "./storage";
import { computeExpenseSummary, CAT_LABELS } from "./expenseUtils";

const CAT_COLORS = {
  food: { bg: "#EAF3DE", color: "#27500A", label: CAT_LABELS.food },
  travel: { bg: "#E6F1FB", color: "#0C447C", label: CAT_LABELS.travel },
  accommodation: { bg: "#EEEDFE", color: "#3C3489", label: CAT_LABELS.accommodation },
  misc: { bg: "#F1EFE8", color: "#444441", label: CAT_LABELS.misc },
  other: { bg: "#FAEEDA", color: "#633806", label: CAT_LABELS.other },
};

function reloadFromStorage() {
  return {
    qafilaName: load(STORAGE_KEYS.NAME, ""),
    brothers: load(STORAGE_KEYS.BROTHERS, []),
    expenses: load(STORAGE_KEYS.EXPENSES, []),
  };
}

export default function ExpenseManager() {
  const [tab, setTab] = useState("brothers");
  const [qafilaName, setQafilaName] = useState(() => load(STORAGE_KEYS.NAME, ""));
  const [brothers, setBrothers] = useState(() => load(STORAGE_KEYS.BROTHERS, []));
  const [expenses, setExpenses] = useState(() => load(STORAGE_KEYS.EXPENSES, []));
  const [brotherInput, setBrotherInput] = useState("");

  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCat, setExpCat] = useState("food");
  const [expPayer, setExpPayer] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [addMsg, setAddMsg] = useState(null);

  const [contributions, setContributions] = useState({});
  const [settleResult, setSettleResult] = useState(null);

  useEffect(() => { save(STORAGE_KEYS.BROTHERS, brothers); }, [brothers]);
  useEffect(() => { save(STORAGE_KEYS.EXPENSES, expenses); }, [expenses]);
  useEffect(() => { save(STORAGE_KEYS.NAME, qafilaName); }, [qafilaName]);

  useEffect(() => {
    const onReset = () => {
      const data = reloadFromStorage();
      setQafilaName(data.qafilaName);
      setBrothers(data.brothers);
      setExpenses(data.expenses);
      setContributions({});
      setSettleResult(null);
      setExpPayer("");
    };
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, []);

  const addBrother = () => {
    const name = brotherInput.trim();
    if (!name || brothers.includes(name)) { setBrotherInput(""); return; }
    const next = [...brothers, name];
    setBrothers(next);
    setBrotherInput("");
    if (!expPayer) setExpPayer(name);
  };

  const removeBrother = (name) => setBrothers(brothers.filter(b => b !== name));

  const addExpense = () => {
    const amount = parseFloat(expAmount);
    if (!expDesc.trim() || isNaN(amount) || amount <= 0 || !expPayer) {
      setAddMsg({ text: "Please fill in all fields.", ok: false });
      setTimeout(() => setAddMsg(null), 2500);
      return;
    }
    const next = [...expenses, { id: Date.now(), desc: expDesc.trim(), amount, cat: expCat, payer: expPayer, date: expDate }];
    setExpenses(next);
    setExpDesc(""); setExpAmount("");
    setAddMsg({ text: `Added: £${amount.toFixed(2)} for ${expDesc.trim()}`, ok: true });
    setTimeout(() => setAddMsg(null), 2500);
  };

  const deleteExpense = (id) => setExpenses(expenses.filter(e => e.id !== id));

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const paid = {};
  brothers.forEach(b => paid[b] = 0);
  expenses.forEach(e => { paid[e.payer] = (paid[e.payer] || 0) + e.amount; });
  const topPayer = Object.entries(paid).sort((a, b) => b[1] - a[1])[0];

  const calculateSettle = () => {
    if (!brothers.length || !expenses.length) return;
    const result = computeExpenseSummary(brothers, expenses, contributions);
    setSettleResult(result);
  };

  const resetExpenses = () => {
    if (!expenses.length) return;
    if (!window.confirm("Delete all expense records? Journey and schedule progress will be kept.")) return;
    clearExpensesOnly();
    setExpenses([]);
    setContributions({});
    setSettleResult(null);
  };

  const tabs = [
    { id: "brothers", label: "👥 Brothers" },
    { id: "add", label: "➕ Add" },
    { id: "log", label: "📋 Log" },
    { id: "settle", label: "🤝 Settle" },
  ];

  const s = { fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0d1117", color: "#e6e6e6" };

  return (
    <div style={s}>
      {/* Sub-tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #2a2a3a", marginBottom: 14 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "9px 2px", border: "none",
              borderBottom: tab === t.id ? "2px solid #d4af7a" : "2px solid transparent",
              background: "transparent", color: tab === t.id ? "#d4af7a" : "#8899aa",
              cursor: "pointer", fontSize: 10, fontWeight: tab === t.id ? 700 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BROTHERS ── */}
      {tab === "brothers" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Qafilah name</div>
            <input value={qafilaName} onChange={e => setQafilaName(e.target.value)}
              placeholder="e.g. Manchester 3-Day June 2026"
              style={{ width: "100%", background: "#141420", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }} />
          </div>
          <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 6 }}>Brothers travelling</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input value={brotherInput} onChange={e => setBrotherInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addBrother()}
              placeholder="Brother's name"
              style={{ flex: 1, background: "#141420", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }} />
            <button onClick={addBrother}
              style={{ background: "#d4af7a", border: "none", borderRadius: 8, padding: "8px 14px", color: "#1a1a2e", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
              + Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {brothers.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, background: "#141420", border: "1px solid #2a2a3a", borderRadius: 20, padding: "5px 12px", fontSize: 12 }}>
                <span>{b}</span>
                <button onClick={() => removeBrother(b)} style={{ border: "none", background: "none", color: "#8899aa", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
          {brothers.length === 0 && (
            <div style={{ textAlign: "center", color: "#8899aa", fontSize: 12, padding: "2rem 0" }}>
              Add the brothers joining this Qafilah
            </div>
          )}
        </div>
      )}

      {/* ── ADD EXPENSE ── */}
      {tab === "add" && (
        <div>
          <div style={{ background: "#141420", border: "1px solid #2a2a3a", borderRadius: 12, padding: "14px" }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Description</div>
              <input value={expDesc} onChange={e => setExpDesc(e.target.value)}
                placeholder="e.g. Petrol to Bradford"
                style={{ width: "100%", background: "#0d1117", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Amount (£)</div>
                <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)}
                  placeholder="0.00" min="0" step="0.01"
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }} />
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Date</div>
                <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)}
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Category</div>
                <select value={expCat} onChange={e => setExpCat(e.target.value)}
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }}>
                  {Object.entries(CAT_COLORS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 4 }}>Paid by</div>
                <select value={expPayer} onChange={e => setExpPayer(e.target.value)}
                  style={{ width: "100%", background: "#0d1117", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", color: "#e6e6e6", fontSize: 12 }}>
                  {brothers.length ? brothers.map(b => <option key={b} value={b}>{b}</option>) : <option value="">Add brothers first</option>}
                </select>
              </div>
            </div>
            <button onClick={addExpense}
              style={{ width: "100%", background: "#d4af7a", border: "none", borderRadius: 8, padding: "10px", color: "#1a1a2e", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              + Add Expense
            </button>
            {addMsg && (
              <div style={{ textAlign: "center", fontSize: 11, marginTop: 8, color: addMsg.ok ? "#7fd4a0" : "#f08080" }}>
                {addMsg.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LOG ── */}
      {tab === "log" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
            {[
              { val: `£${total.toFixed(2)}`, lbl: "Total spent" },
              { val: expenses.length, lbl: "Expenses" },
              { val: topPayer ? topPayer[0].split(" ")[0] : "—", lbl: "Top payer" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#141420", borderRadius: 10, padding: "10px", textAlign: "center", border: "1px solid #2a2a3a" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#d4af7a" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#8899aa", marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          {expenses.length === 0 ? (
            <div style={{ textAlign: "center", color: "#8899aa", fontSize: 12, padding: "2rem 0" }}>No expenses yet.</div>
          ) : (
            [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => {
              const cat = CAT_COLORS[e.cat] || CAT_COLORS.misc;
              return (
                <div key={e.id} style={{ background: "#141420", border: "1px solid #2a2a3a", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: cat.bg, color: cat.color, fontWeight: 600 }}>{cat.label}</span>
                      <span style={{ fontSize: 10, color: "#8899aa" }}>{e.date}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e6e6e6", marginBottom: 2 }}>{e.desc}</div>
                    <div style={{ fontSize: 11, color: "#8899aa" }}>Paid by {e.payer}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#d4af7a" }}>£{e.amount.toFixed(2)}</span>
                    <button onClick={() => deleteExpense(e.id)}
                      style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 6, padding: "2px 8px", color: "#8899aa", cursor: "pointer", fontSize: 11 }}>
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── SETTLE ── */}
      {tab === "settle" && (
        <div>
          <div style={{ background: "#141420", border: "1px solid #2a2a3a", borderRadius: 12, padding: "14px", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 4 }}>Custom contribution per brother</div>
            <div style={{ fontSize: 11, color: "#8899aa", marginBottom: 12 }}>Set how much each brother should contribute. Leave blank to split equally.</div>
            {brothers.length === 0 ? (
              <div style={{ fontSize: 12, color: "#8899aa" }}>Add brothers first.</div>
            ) : (
              brothers.map(b => (
                <div key={b} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e2030" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{b}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#8899aa" }}>£</span>
                    <input type="number" min="0" step="0.01"
                      placeholder={brothers.length ? (total / brothers.length).toFixed(2) : "0"}
                      value={contributions[b] || ""}
                      onChange={e => setContributions(prev => ({ ...prev, [b]: e.target.value }))}
                      style={{ width: 90, background: "#0d1117", border: "1px solid #2a2a3a", borderRadius: 8, padding: "6px 10px", color: "#e6e6e6", fontSize: 12 }} />
                  </div>
                </div>
              ))
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, marginBottom: 12, padding: "8px 0", borderTop: "1px solid #2a2a3a" }}>
              <span style={{ fontSize: 12, color: "#8899aa" }}>Total expenses</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#d4af7a" }}>£{total.toFixed(2)}</span>
            </div>
            <button onClick={calculateSettle}
              style={{ width: "100%", background: "#d4af7a", border: "none", borderRadius: 8, padding: "10px", color: "#1a1a2e", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              Calculate who owes what
            </button>
          </div>

          {settleResult && (
            <div>
              <div style={{ background: "#141420", border: "1px solid #2a2a3a", borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 10 }}>Summary</div>
                {brothers.map(b => {
                  const bal = settleResult.balance[b];
                  return (
                    <div key={b} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #1e2030" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{b}</div>
                        <div style={{ fontSize: 10, color: "#8899aa" }}>
                          Paid £{(settleResult.paid[b] || 0).toFixed(2)} · Should pay £{settleResult.shouldPay[b].toFixed(2)}
                        </div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: bal >= 0 ? "#7fd4a0" : "#f08080" }}>
                        {bal >= 0 ? "+" : ""}£{bal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "#141420", border: "1px solid #2a2a3a", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#d4af7a", marginBottom: 10 }}>Payments needed</div>
                {settleResult.transactions.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#7fd4a0", fontSize: 13 }}>✓ All settled!</div>
                ) : (
                  settleResult.transactions.map((t, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #1e2030" }}>
                      <span style={{ fontSize: 13 }}>
                        <strong>{t.from}</strong> <span style={{ color: "#8899aa" }}>→</span> <strong>{t.to}</strong>
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#f08080" }}>£{t.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={resetExpenses}
            disabled={!expenses.length}
            style={{
              width: "100%",
              marginTop: 12,
              background: "transparent",
              border: "1px solid #4a2a2a",
              borderRadius: 8,
              padding: "10px",
              color: expenses.length ? "#f08080" : "#556",
              fontWeight: 600,
              cursor: expenses.length ? "pointer" : "not-allowed",
              fontSize: 12,
            }}
          >
            Reset all expenses
          </button>
        </div>
      )}
    </div>
  );
}
