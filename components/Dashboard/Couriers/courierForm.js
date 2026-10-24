// quick-fill suggestions for popular Bangladeshi couriers
export const suggestions = [
  { name: "Steadfast Courier", color: "#00a651", website: "https://steadfast.com.bd" },
  { name: "Pathao Courier", color: "#e5202e", website: "https://pathao.com" },
  { name: "RedX", color: "#d7263d", website: "https://redx.com.bd" },
  { name: "Paperfly", color: "#f58220", website: "https://paperfly.com.bd" },
  { name: "Sundarban Courier", color: "#1f4e9a", website: "https://sundarbancourierltd.com" },
  { name: "eCourier", color: "#6c2c91", website: "https://ecourier.com.bd" },
  { name: "SA Paribahan", color: "#0f766e", website: "" },
  { name: "Delivery Tiger", color: "#f59e0b", website: "" },
];

export const emptyForm = {
  name: "",
  logo: "",
  color: "#1c2024",
  website: "",
  phone: "",
  trackingUrl: "",
  insideDhaka: "60",
  outsideDhaka: "120",
  perKg: "20",
  codChargePercent: "1",
  timeInside: "1-2 days",
  timeOutside: "2-4 days",
  merchantId: "",
  notes: "",
  isActive: true,
};

export const toForm = (c) => ({
  name: c.name,
  logo: c.logo || "",
  color: c.color || "#1c2024",
  website: c.website || "",
  phone: c.phone || "",
  trackingUrl: c.trackingUrl || "",
  insideDhaka: String(c.charges?.insideDhaka ?? 0),
  outsideDhaka: String(c.charges?.outsideDhaka ?? 0),
  perKg: String(c.charges?.perKg ?? 0),
  codChargePercent: String(c.codChargePercent ?? 0),
  timeInside: c.deliveryTime?.insideDhaka || "",
  timeOutside: c.deliveryTime?.outsideDhaka || "",
  merchantId: c.merchantId || "",
  notes: c.notes || "",
  isActive: c.isActive,
});

export const hostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// form values -> API payload
export const toPayload = (form) => ({
  name: form.name.trim(),
  logo: form.logo.trim(),
  color: form.color,
  website: form.website.trim(),
  phone: form.phone.trim(),
  trackingUrl: form.trackingUrl.trim(),
  charges: { insideDhaka: Number(form.insideDhaka) || 0, outsideDhaka: Number(form.outsideDhaka) || 0, perKg: Number(form.perKg) || 0 },
  codChargePercent: Number(form.codChargePercent) || 0,
  deliveryTime: { insideDhaka: form.timeInside.trim(), outsideDhaka: form.timeOutside.trim() },
  merchantId: form.merchantId.trim(),
  notes: form.notes.trim(),
  isActive: form.isActive,
});
