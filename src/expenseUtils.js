export const CAT_LABELS = {
  food: "Food",
  travel: "Travel",
  accommodation: "Accommodation",
  misc: "Misc",
  other: "Other",
};

export function computeExpenseSummary(brothers, expenses, contributions = {}) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const paid = {};
  brothers.forEach((b) => { paid[b] = 0; });
  expenses.forEach((e) => { paid[e.payer] = (paid[e.payer] || 0) + e.amount; });

  if (!brothers.length || !expenses.length) {
    return { total, paid, shouldPay: {}, balance: {}, transactions: [] };
  }

  let customTotal = 0;
  const contrib = {};
  brothers.forEach((b) => {
    const v = parseFloat(contributions[b] || 0);
    contrib[b] = isNaN(v) || v === 0 ? null : v;
    if (contrib[b]) customTotal += contrib[b];
  });
  const unset = brothers.filter((b) => contrib[b] === null);
  const remaining = Math.max(0, total - customTotal);
  const equalShare = unset.length ? remaining / unset.length : 0;
  const shouldPay = {};
  brothers.forEach((b) => {
    shouldPay[b] = contrib[b] !== null ? contrib[b] : +equalShare.toFixed(2);
  });
  const balance = {};
  brothers.forEach((b) => {
    balance[b] = +(((paid[b] || 0) - shouldPay[b]).toFixed(2));
  });

  const creditors = brothers
    .filter((b) => balance[b] > 0.005)
    .map((b) => ({ name: b, amount: balance[b] }))
    .sort((a, b) => b.amount - a.amount);
  const debtors = brothers
    .filter((b) => balance[b] < -0.005)
    .map((b) => ({ name: b, amount: -balance[b] }))
    .sort((a, b) => b.amount - a.amount);

  const transactions = [];
  const cred = creditors.map((c) => ({ ...c }));
  const debt = debtors.map((d) => ({ ...d }));
  let ci = 0;
  let di = 0;
  while (ci < cred.length && di < debt.length) {
    const pay = Math.min(cred[ci].amount, debt[di].amount);
    if (pay > 0.005) {
      transactions.push({ from: debt[di].name, to: cred[ci].name, amount: +pay.toFixed(2) });
    }
    cred[ci].amount -= pay;
    debt[di].amount -= pay;
    if (cred[ci].amount < 0.005) ci++;
    if (debt[di].amount < 0.005) di++;
  }

  return { total, paid, shouldPay, balance, transactions };
}
