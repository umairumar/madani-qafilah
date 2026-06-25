import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  SCHEDULE,
  MONTHLY_SUNNAHS,
  MONTHLY_DUAS,
  MONTHLY_SALAH_LAWS,
} from "./qafilahData";
import { monthDayKey } from "./storage";

function formatDate(iso) {
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
  return (text || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function collectActivitiesByDay(checkedItems, qafilaType) {
  const byDay = {};
  for (let day = 1; day <= qafilaType; day++) {
    const items = [];
    SCHEDULE.forEach((session) => {
      session.activities.forEach((act, idx) => {
        const key = `${day}-${session.id}-${idx}`;
        if (checkedItems[key]) {
          items.push({
            session: session.label,
            time: act.time,
            task: act.task,
          });
        }
      });
    });
    if (items.length) byDay[day] = items;
  }
  return byDay;
}

function collectCompletedSunnahs(sunnahsDone, selectedMonth, qafilaType) {
  const sunnahs = MONTHLY_SUNNAHS[selectedMonth] || [];
  const byDay = {};
  for (let day = 1; day <= Math.min(qafilaType, 3); day++) {
    const key = monthDayKey(selectedMonth, day);
    if (!sunnahsDone[key]) continue;
    const item = sunnahs.find((s) => s.day === day);
    if (item) {
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ topic: item.topic, ref: item.ref });
    }
  }
  return byDay;
}

function collectCompletedSalahLaws(salahDone, selectedMonth, qafilaType) {
  const laws = MONTHLY_SALAH_LAWS[selectedMonth] || [];
  const byDay = {};
  for (let day = 1; day <= Math.min(qafilaType, 3); day++) {
    const key = monthDayKey(selectedMonth, day);
    if (!salahDone[key]) continue;
    const item = laws.find((s) => s.day === day);
    if (item) {
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ topic: item.topic, ref: item.ref });
    }
  }
  return byDay;
}

function collectCompletedDuas(duasDone, selectedMonth, qafilaType) {
  const duas = MONTHLY_DUAS[selectedMonth] || [];
  const byDay = {};
  for (let day = 1; day <= Math.min(qafilaType, 3); day++) {
    const key = monthDayKey(selectedMonth, day);
    if (!duasDone[key]) continue;
    const item = duas.find((d) => d.day === day);
    if (item) {
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ dua: item.dua, page: item.page });
    }
  }
  return byDay;
}

function addSectionTitle(doc, y, title) {
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, y);
  return y + 6;
}

function ensureSpace(doc, y, needed = 20) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 20) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function buildReportSummary({
  journey,
  brothers,
  qafilaType,
  selectedMonth,
  checkedItems,
  sunnahsDone,
  duasDone,
  salahDone,
}) {
  const activitiesByDay = collectActivitiesByDay(checkedItems, qafilaType);
  const sunnahsByDay = collectCompletedSunnahs(sunnahsDone, selectedMonth, qafilaType);
  const salahByDay = collectCompletedSalahLaws(salahDone, selectedMonth, qafilaType);
  const duasByDay = collectCompletedDuas(duasDone, selectedMonth, qafilaType);

  const activityCount = Object.values(activitiesByDay).reduce((s, arr) => s + arr.length, 0);
  const sunnahCount = Object.values(sunnahsByDay).reduce((s, arr) => s + arr.length, 0);
  const salahCount = Object.values(salahByDay).reduce((s, arr) => s + arr.length, 0);
  const duaCount = Object.values(duasByDay).reduce((s, arr) => s + arr.length, 0);

  return {
    activitiesByDay,
    sunnahsByDay,
    salahByDay,
    duasByDay,
    activityCount,
    sunnahCount,
    salahCount,
    duaCount,
    journey,
    brothers,
    qafilaType,
    selectedMonth,
  };
}

export function generateReportPdf({
  journey,
  brothers,
  qafilaType,
  selectedMonth,
  checkedItems,
  sunnahsDone,
  duasDone,
  salahDone,
}) {
  const summary = buildReportSummary({
    journey,
    brothers,
    qafilaType,
    selectedMonth,
    checkedItems,
    sunnahsDone,
    duasDone,
    salahDone,
  });

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 18;

  doc.setFontSize(18);
  doc.setTextColor(26, 10, 48);
  doc.setFont("helvetica", "bold");
  doc.text("Madani Qafilah Report", 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`${qafilaType}-Day Qafilah · ${selectedMonth}`, 14, y);
  y += 10;

  doc.setDrawColor(212, 175, 122);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "bold");
  doc.text("Journey", 14, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const route =
    journey.fromCity && journey.toCity
      ? `${journey.fromCity} → ${journey.toCity}`
      : journey.fromCity || journey.toCity || "—";
  doc.text(`Route: ${route}`, 14, y);
  y += 5;
  if (journey.venueName) {
    doc.text(`Venue: ${journey.venueName}`, 14, y);
    y += 5;
  }
  if (journey.venueAddress) {
    const lines = doc.splitTextToSize(`Address: ${journey.venueAddress}`, 182);
    doc.text(lines, 14, y);
    y += lines.length * 5;
  }
  const dateRange = `${formatDate(journey.startDate)} – ${formatDate(journey.endDate)}`;
  doc.text(`Dates: ${dateRange}`, 14, y);
  y += 10;

  y = addSectionTitle(doc, y, "Brothers Who Travelled");
  if (brothers.length === 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No brothers recorded.", 14, y);
    y += 8;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    brothers.forEach((name) => {
      doc.text(`• ${name}`, 16, y);
      y += 5;
    });
    y += 4;
  }

  y = ensureSpace(doc, y, 30);
  y = addSectionTitle(doc, y, "Activities Completed");

  const dayKeys = Object.keys(summary.activitiesByDay).map(Number).sort((a, b) => a - b);
  if (!dayKeys.length) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No activities marked complete.", 14, y);
    y += 10;
  } else {
    dayKeys.forEach((day) => {
      y = ensureSpace(doc, y, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day}`, 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Session", "Time", "Activity"]],
        body: summary.activitiesByDay[day].map((a) => [a.session, a.time, a.task]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [45, 107, 74] },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 8;
    });
  }

  y = ensureSpace(doc, y, 30);
  y = addSectionTitle(doc, y, "Sunnahs Completed");

  const sunnahDays = Object.keys(summary.sunnahsByDay).map(Number).sort((a, b) => a - b);
  if (!sunnahDays.length) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No sunnahs marked complete.", 14, y);
    y += 10;
  } else {
    sunnahDays.forEach((day) => {
      y = ensureSpace(doc, y, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day}`, 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Topic", "Reference"]],
        body: summary.sunnahsByDay[day].map((s) => [s.topic, s.ref]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [45, 107, 74] },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 8;
    });
  }

  const salahDays = Object.keys(summary.salahByDay).map(Number).sort((a, b) => a - b);
  if (salahDays.length) {
    y = ensureSpace(doc, y, 30);
    y = addSectionTitle(doc, y, "Laws of Salah Completed");
    salahDays.forEach((day) => {
      y = ensureSpace(doc, y, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day}`, 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Topic", "Reference"]],
        body: summary.salahByDay[day].map((s) => [s.topic, s.ref]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [45, 74, 107] },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 8;
    });
  }

  y = ensureSpace(doc, y, 30);
  y = addSectionTitle(doc, y, "Du'as Completed");

  const duaDays = Object.keys(summary.duasByDay).map(Number).sort((a, b) => a - b);
  if (!duaDays.length) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No du'as marked complete.", 14, y);
    y += 10;
  } else {
    duaDays.forEach((day) => {
      y = ensureSpace(doc, y, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day}`, 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [["Du'a", "Page"]],
        body: summary.duasByDay[day].map((d) => [d.dua, `p. ${d.page}`]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [107, 45, 74] },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 8;
    });
  }

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-GB")} · Path to Piety Companion · Dawat-e-Islami`,
    14,
    pageHeight - 10
  );

  const filename = `madani-qafilah-report-${slugify(journey.toCity)}-${journey.startDate || "trip"}.pdf`;
  doc.save(filename);
}
