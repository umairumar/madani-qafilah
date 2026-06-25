import { jsPDF } from "jspdf";

const COLORS = {
  headerBg: [26, 26, 46],
  gold: [212, 175, 122],
  goldDark: [180, 145, 90],
  text: [45, 45, 55],
  muted: [110, 110, 125],
  cardBg: [248, 246, 242],
  cardBorder: [230, 220, 200],
  accentGreen: [45, 107, 74],
  white: [255, 255, 255],
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

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
  return (text || "journey")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function buildMapsUrl(journey) {
  const query = [journey.venueName, journey.venueAddress].filter(Boolean).join(", ");
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function drawCard(doc, x, y, width, height) {
  doc.setFillColor(...COLORS.cardBg);
  doc.setDrawColor(...COLORS.cardBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, height, 3, 3, "FD");
}

export function generateJourneyPdf({ journey, brothers = [], qafilaType, selectedMonth }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // Header band
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
  doc.text("Journey Details", margin, 34);

  const tripLabel = `${qafilaType}-Day Qafilah · ${selectedMonth}`;
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 195);
  doc.text(tripLabel, margin, 42);

  let y = 64;

  // Route hero
  const from = journey.fromCity?.trim() || "—";
  const to = journey.toCity?.trim() || "—";

  doc.setFillColor(...COLORS.cardBg);
  doc.setDrawColor(...COLORS.gold);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentW, 28, 4, 4, "FD");

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "bold");
  doc.text("ROUTE", margin + 8, y + 8);

  doc.setFontSize(16);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "bold");
  const routeText = `${from}  →  ${to}`;
  const routeLines = doc.splitTextToSize(routeText, contentW - 16);
  doc.text(routeLines, margin + 8, y + 18);

  y += 36;

  // Dates row
  const startFormatted = formatDate(journey.startDate);
  const endFormatted = formatDate(journey.endDate);
  const dateRange =
    startFormatted && endFormatted
      ? `${startFormatted}  to  ${endFormatted}`
      : startFormatted || endFormatted || "Dates not set";

  drawCard(doc, margin, y, contentW, 22);
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "bold");
  doc.text("DATES", margin + 8, y + 8);
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  const dateLines = doc.splitTextToSize(dateRange, contentW - 16);
  doc.text(dateLines, margin + 8, y + 15);

  y += 30;

  // Venue card
  if (journey.venueName || journey.venueAddress) {
    const addressLines = journey.venueAddress
      ? doc.splitTextToSize(journey.venueAddress, contentW - 16)
      : [];
    const cardH = 18 + (journey.venueName ? 8 : 0) + addressLines.length * 5.5;

    drawCard(doc, margin, y, contentW, cardH);

    let cardY = y + 8;
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.text("VENUE", margin + 8, cardY);
    cardY += 6;

    if (journey.venueName) {
      doc.setFontSize(13);
      doc.setTextColor(...COLORS.text);
      doc.setFont("helvetica", "bold");
      doc.text(journey.venueName, margin + 8, cardY);
      cardY += 7;
    }

    if (addressLines.length) {
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.muted);
      doc.setFont("helvetica", "normal");
      doc.text(addressLines, margin + 8, cardY);
    }

    y += cardH + 8;

    const mapsUrl = buildMapsUrl(journey);
    if (mapsUrl) {
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.accentGreen);
      doc.setFont("helvetica", "bold");
      doc.textWithLink("Open venue in Google Maps", margin + 8, y, { url: mapsUrl });
      y += 10;
    }
  }

  // Ameer card
  if (journey.ameerName || journey.ameerPhone) {
    const cardH = journey.ameerName && journey.ameerPhone ? 28 : 20;
    drawCard(doc, margin, y, contentW, cardH);

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.text("AMEER (CONTACT)", margin + 8, y + 8);

    let ameerY = y + 16;
    if (journey.ameerName) {
      doc.setFontSize(12);
      doc.setTextColor(...COLORS.text);
      doc.setFont("helvetica", "bold");
      doc.text(journey.ameerName, margin + 8, ameerY);
      ameerY += 7;
    }
    if (journey.ameerPhone) {
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.accentGreen);
      doc.setFont("helvetica", "normal");
      const phone = journey.ameerPhone.trim();
      doc.textWithLink(phone, margin + 8, ameerY, { url: `tel:${phone.replace(/\s/g, "")}` });
    }

    y += cardH + 8;
  }

  // Brothers
  if (brothers.length > 0) {
    const cols = 2;
    const rowH = 6;
    const rows = Math.ceil(brothers.length / cols);
    const cardH = 14 + rows * rowH;

    drawCard(doc, margin, y, contentW, cardH);

    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "bold");
    doc.text(`BROTHERS (${brothers.length})`, margin + 8, y + 8);

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont("helvetica", "normal");

    const colW = (contentW - 16) / cols;
    brothers.forEach((name, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      doc.text(`• ${name}`, margin + 8 + col * colW, y + 16 + row * rowH);
    });

    y += cardH + 8;
  }

  // Summary strip
  drawCard(doc, margin, y, contentW, 20);
  const summaryParts = [
    `${qafilaType}-day Qafilah`,
    selectedMonth,
    brothers.length ? `${brothers.length} brother${brothers.length > 1 ? "s" : ""}` : null,
  ].filter(Boolean);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.text(summaryParts.join("  ·  "), margin + 8, y + 12);

  // Footer
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

  const filename = `madani-qafilah-journey-${slugify(journey.toCity)}-${journey.startDate || "trip"}.pdf`;
  doc.save(filename);
}
