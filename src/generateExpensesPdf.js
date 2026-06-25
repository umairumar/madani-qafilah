import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { computeExpenseSummary, CAT_LABELS } from "./expenseUtils";

const COLORS = {
  headerBg: [26, 26, 46],
  gold: [212, 175, 122],
  text: [45, 45, 55],
  muted: [110, 110, 125],
  cardBg: [248, 246, 242],
  cardBorder: [230, 220, 200],
  accentGreen: [45, 107, 74],
  accentRed: [180, 80, 80],
  white: [255, 255, 255],
  tableHead: [45, 107, 74],
};

function formatDateShort(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function slugify(text) {
  return (text || "expenses")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function drawCard(doc, x, y, width, height) {
  doc.setFillColor(...COLORS.cardBg);
  doc.setDrawColor(...COLORS.cardBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, height, 3, 3, "FD");
}

function ensureSpace(doc, y, needed = 25) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 22) {
    doc.addPage();
    return 20;
  }
  return y;
}

function drawFooter(doc, margin, pageW) {
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.4);
  doc.line(margin, pageH - 18, pageW - margin, pageH - 18);
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "italic");
  doc.text("Path to Piety Companion · Share this PDF on WhatsApp with your Qafilah group", margin, pageH - 12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated ${formatDateShort(new Date().toISOString().split("T")[0])}`, margin, pageH - 7);
}

function categoryTotals(expenses) {
  const totals = {};
  expenses.forEach((e) => {
    const key = e.cat || "misc";
    totals[key] = (totals[key] || 0) + e.amount;
  });
  return Object.entries(totals)
    .map(([cat, amount]) => ({ cat, label: CAT_LABELS[cat] || cat, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function generateExpensesPdf({
  journey = {},
  brothers = [],
  expenses = [],
  contributions = {},
}) {
  const summary = computeExpenseSummary(brothers, expenses, contributions);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // Header
  doc.setFillColor(...COLORS.headerBg);
  doc.rect(0, 0, pageW, 52, "F");
  doc.setFillColor(...COLORS.gold);
  doc.rect(0, 52, pageW, 1.2, "F");

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gold);
  doc.setFont("helvetica", "bold");
  doc.text("DAWAT-E-ISLAMI", margin, 14);

  doc.setFontSize(22);
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.text("Madani Qafilah", margin, 26);

  doc.setFontSize(11);
  doc.setTextColor(...COLORS.gold);
  doc.setFont("helvetica", "normal");
  doc.text("Expenses Report", margin, 34);

  const route =
    journey.fromCity?.trim() && journey.toCity?.trim()
      ? `${journey.fromCity} → ${journey.toCity}`
      : journey.fromCity?.trim() || journey.toCity?.trim() || null;
  const dateRange =
    journey.startDate || journey.endDate
      ? `${formatDateShort(journey.startDate)} – ${formatDateShort(journey.endDate)}`
      : null;
  const metaLine = [route, dateRange].filter(Boolean).join("  ·  ");
  if (metaLine) {
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 195);
    doc.text(metaLine, margin, 42);
  }

  let y = 62;

  // Summary stats
  const statW = (contentW - 8) / 3;
  const stats = [
    { label: "Total spent", value: `£${summary.total.toFixed(2)}` },
    { label: "Expenses", value: String(expenses.length) },
    { label: "Brothers", value: String(brothers.length) },
  ];
  stats.forEach((stat, i) => {
    const x = margin + i * (statW + 4);
    drawCard(doc, x, y, statW, 22);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.text(stat.label.toUpperCase(), x + 6, y + 8);
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, x + 6, y + 17);
  });
  y += 30;

  // Brothers list
  if (brothers.length) {
    y = ensureSpace(doc, y, 20);
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.text("PARTICIPANTS", margin, y);
    y += 5;
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "normal");
    doc.text(brothers.join("  ·  "), margin, y);
    y += 10;
  }

  // Expense log
  y = ensureSpace(doc, y, 30);
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("Expense log", margin, y);
  y += 4;

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  autoTable(doc, {
    startY: y,
    head: [["Date", "Description", "Category", "Paid by", "Amount"]],
    body: sortedExpenses.map((e) => [
      formatDateShort(e.date),
      e.desc,
      CAT_LABELS[e.cat] || e.cat,
      e.payer,
      `£${e.amount.toFixed(2)}`,
    ]),
    styles: { fontSize: 9, cellPadding: 3, textColor: COLORS.text },
    headStyles: { fillColor: COLORS.tableHead, textColor: COLORS.white, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [252, 250, 247] },
    margin: { left: margin, right: margin },
  });
  y = doc.lastAutoTable.finalY + 10;

  // By category
  const byCat = categoryTotals(expenses);
  if (byCat.length) {
    y = ensureSpace(doc, y, 30);
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.text("Spending by category", margin, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Category", "Amount", "% of total"]],
      body: byCat.map((c) => [
        c.label,
        `£${c.amount.toFixed(2)}`,
        summary.total ? `${((c.amount / summary.total) * 100).toFixed(0)}%` : "—",
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: COLORS.tableHead, textColor: COLORS.white },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Per-brother summary
  if (brothers.length) {
    y = ensureSpace(doc, y, 30);
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "bold");
    doc.text("Per-brother summary", margin, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Brother", "Paid", "Should pay", "Balance"]],
      body: brothers.map((b) => {
        const bal = summary.balance[b] || 0;
        return [
          b,
          `£${(summary.paid[b] || 0).toFixed(2)}`,
          `£${(summary.shouldPay[b] || 0).toFixed(2)}`,
          `${bal >= 0 ? "+" : ""}£${bal.toFixed(2)}`,
        ];
      }),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: COLORS.tableHead, textColor: COLORS.white },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Payments needed
  y = ensureSpace(doc, y, 25);
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "bold");
  doc.text("Payments needed", margin, y);
  y += 4;

  if (!summary.transactions.length) {
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.accentGreen);
    doc.setFont("helvetica", "bold");
    doc.text("All settled — no payments required.", margin, y + 4);
    y += 12;
  } else {
    autoTable(doc, {
      startY: y,
      head: [["From", "To", "Amount"]],
      body: summary.transactions.map((t) => [
        t.from,
        t.to,
        `£${t.amount.toFixed(2)}`,
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [180, 80, 80], textColor: COLORS.white },
      margin: { left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  drawFooter(doc, margin, pageW);

  const slug = slugify(journey.toCity || journey.fromCity);
  const filename = `madani-qafilah-expenses-${slug}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
