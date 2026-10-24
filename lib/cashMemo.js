// Cash memo PDF (A4). The item table flows onto as many pages as needed;
// every page repeats the store header and gets a "Page x of y" footer.
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const PAYMENT_LABELS = {
  cash: "Cash",
  card: "Card",
  bkash: "bKash",
  nagad: "Nagad",
  ssl_commerz: "SSLCommerz",
  stripe: "Stripe",
  shurjopay: "ShurjoPay",
  cash_on_delivery: "Cash on delivery",
};

// the PDF core fonts have no ৳ glyph, so amounts use "Tk"
const tk = (n) => `Tk ${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const twoDigits = (n) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ""}`);
const threeDigits = (n) => `${n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " : ""}` : ""}${n % 100 ? twoDigits(n % 100) : ""}`;

// Bangladeshi numbering: crore, lakh, thousand
export const amountInWords = (amount) => {
  let n = Math.round(Number(amount) || 0);
  if (n === 0) return "Zero Taka Only";
  const parts = [];
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (crore) parts.push(`${crore >= 100 ? threeDigits(crore) : twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (n) parts.push(threeDigits(n));
  return `${parts.join(" ")} Taka Only`;
};

const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

/**
 * Build the memo. `order` is an invoice from the API, `store` the store settings.
 * Returns the jsPDF document.
 */
export function buildCashMemo(order, store = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 14;
  const INK = [28, 32, 36];
  const MUTED = [107, 114, 128];
  const BRAND = [45, 143, 106];

  const storeName = store.storeName || "Gadget Brust";
  const customer = order.user_id?.fullName || order.customer?.name || "Walk-in customer";
  const phone = order.customer?.phone || order.phone || "";
  const items = order.items || [];
  const isPos = order.source === "pos";

  const drawHeader = () => {
    // brand bar
    doc.setFillColor(...BRAND);
    doc.rect(0, 0, W, 3, "F");

    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(storeName.toUpperCase(), M, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    const contact = [store.address, [store.phone, store.email].filter(Boolean).join("  |  ")].filter(Boolean);
    contact.forEach((line, i) => doc.text(String(line), M, 22.5 + i * 4.2));

    // memo label box
    doc.setFillColor(...INK);
    doc.roundedRect(W - M - 52, 9, 52, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(isPos ? "CASH MEMO" : "INVOICE", W - M - 26, 15.6, { align: "center" });

    doc.setTextColor(...INK);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const meta = [
      ["Memo No", order.invoiceNumber],
      ["Date", `${fmtDate(order.orderDate)}  ${fmtTime(order.orderDate)}`],
    ];
    meta.forEach(([label, value], i) => {
      doc.setTextColor(...MUTED);
      doc.text(`${label}:`, W - M - 52, 25 + i * 4.5);
      doc.setTextColor(...INK);
      doc.setFont("helvetica", "bold");
      doc.text(String(value), W - M, 25 + i * 4.5, { align: "right" });
      doc.setFont("helvetica", "normal");
    });

    // bill-to strip
    doc.setDrawColor(220, 223, 215);
    doc.setFillColor(243, 244, 239);
    doc.roundedRect(M, 36, W - 2 * M, 14, 2, 2, "FD");
    const cols = [
      ["Customer", customer],
      ["Phone", phone || "-"],
      ["Payment", PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || "-"],
      [isPos ? "Served by" : "Status", isPos ? order.cashier?.fullName || "-" : order.orderStatus || "-"],
    ];
    const colW = (W - 2 * M) / cols.length;
    cols.forEach(([label, value], i) => {
      const x = M + 4 + i * colW;
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(label.toUpperCase(), x, 41);
      doc.setFontSize(9);
      doc.setTextColor(...INK);
      doc.setFont("helvetica", "bold");
      doc.text(doc.splitTextToSize(String(value), colW - 6)[0], x, 46);
      doc.setFont("helvetica", "normal");
    });
  };

  const HEADER_BOTTOM = 56;

  autoTable(doc, {
    startY: HEADER_BOTTOM,
    margin: { top: HEADER_BOTTOM, left: M, right: M, bottom: 22 },
    head: [["SL", "Product", "Qty", "Unit price", "Amount"]],
    body: items.map((item, i) => [String(i + 1), item.title, String(item.qty), tk(item.price), tk(item.price * item.qty)]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9, textColor: INK, cellPadding: { top: 2.6, bottom: 2.6, left: 2.5, right: 2.5 }, lineColor: [233, 235, 229], lineWidth: { bottom: 0.2 } },
    headStyles: { fillColor: INK, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    alternateRowStyles: { fillColor: [248, 248, 245] },
    columnStyles: {
      0: { cellWidth: 11, halign: "center" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 34, halign: "right", fontStyle: "bold" },
    },
    // align header cells with their column's values
    didParseCell: (data) => {
      if (data.section === "head") data.cell.styles.halign = ["center", "left", "center", "right", "right"][data.column.index];
    },
    didDrawPage: drawHeader,
  });

  // totals on the last page (new page if they don't fit)
  let y = doc.lastAutoTable.finalY + 6;
  const discountLines = [];
  if (order.coupon?.code) discountLines.push([`Coupon (${order.coupon.code})`, -order.coupon.discount]);
  const otherDiscount = (order.discount || 0) - (order.coupon?.discount || 0);
  if (otherDiscount > 0) discountLines.push(["Discount", -otherDiscount]);
  const rows = [
    ["Subtotal", order.subtotal],
    ...discountLines,
    ...(order.tax ? [["VAT", order.tax]] : []),
    ...(order.shippingCharge ? [["Delivery", order.shippingCharge]] : []),
  ];
  const paidRows = isPos && order.payment?.amountPaid ? [["Received", order.payment.amountPaid], ["Change", order.payment.change || 0]] : [];
  const blockHeight = rows.length * 6 + 12 + paidRows.length * 6 + 46;
  if (y + blockHeight > H - 24) {
    doc.addPage();
    drawHeader();
    y = HEADER_BOTTOM + 4;
  }

  const boxX = W - M - 80;
  const blockTop = y;
  doc.setFontSize(9);
  rows.forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    doc.text(label, boxX, y);
    doc.setTextColor(...INK);
    doc.text(value < 0 ? `- ${tk(-value)}` : tk(value), W - M, y, { align: "right" });
    y += 6;
  });
  doc.setFillColor(...INK);
  doc.roundedRect(boxX - 3, y - 4, 83, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Grand total", boxX, y + 2.5);
  doc.text(tk(order.total), W - M - 1, y + 2.5, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 12;
  doc.setFontSize(9);
  paidRows.forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    doc.text(label, boxX, y);
    doc.setTextColor(...INK);
    doc.text(tk(value), W - M, y, { align: "right" });
    y += 6;
  });

  // in words + notes beside the totals
  const leftW = boxX - M - 10;
  let ly = blockTop;
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("AMOUNT IN WORDS", M, ly);
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  const words = doc.splitTextToSize(amountInWords(order.total), leftW);
  doc.text(words, M, ly + 5);
  doc.setFont("helvetica", "normal");
  ly += 5 + words.length * 4.5;
  if (order.notes) {
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("NOTE", M, ly + 4);
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    const note = doc.splitTextToSize(String(order.notes), leftW);
    doc.text(note, M, ly + 8.5);
    ly += 8.5 + note.length * 4;
  }

  // policy + signatures
  y = Math.max(y, ly) + 8;
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Goods once sold can be replaced within 7 days with this memo, if the item is in its original condition.", M, y);
  y += 18;
  doc.setDrawColor(...MUTED);
  doc.line(M, y, M + 55, y);
  doc.line(W - M - 55, y, W - M, y);
  doc.text("Customer signature", M, y + 4.5);
  doc.text("Authorised signature", W - M, y + 4.5, { align: "right" });

  // footer on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(220, 223, 215);
    doc.line(M, H - 15, W - M, H - 15);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`Thank you for shopping with ${storeName}!`, M, H - 9.5);
    doc.text(`${order.invoiceNumber}  ·  Page ${i} of ${pages}`, W - M, H - 9.5, { align: "right" });
  }

  return doc;
}

export const downloadCashMemo = (order, store) => buildCashMemo(order, store).save(`${order.invoiceNumber}.pdf`);

// open the PDF in a new tab (browser print dialog from there)
export const openCashMemo = (order, store) => {
  const url = buildCashMemo(order, store).output("bloburl");
  window.open(url, "_blank", "noopener");
};
