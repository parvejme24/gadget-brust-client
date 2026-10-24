export const emptyForm = {
  name: "",
  description: "",
  baseCharge: "60",
  perKgCharge: "0",
  minOrderAmount: "0",
  freeShippingThreshold: "0",
  minDays: "1",
  maxDays: "3",
  zones: "",
  isActive: true,
};

export const toForm = (s) => ({
  name: s.name,
  description: s.description || "",
  baseCharge: String(s.baseCharge),
  perKgCharge: String(s.perKgCharge),
  minOrderAmount: String(s.minOrderAmount),
  freeShippingThreshold: String(s.freeShippingThreshold),
  minDays: String(s.estimatedDays?.min ?? 1),
  maxDays: String(s.estimatedDays?.max ?? 3),
  zones: (s.zones || []).map((z) => (z.additionalCharge ? `${z.name}:${z.additionalCharge}` : z.name)).join(", "),
  isActive: s.isActive,
});

// zones are typed as "Dhaka City, Remote Areas:50"
export const toPayload = (form) => ({
  name: form.name.trim(),
  description: form.description.trim(),
  baseCharge: Number(form.baseCharge) || 0,
  perKgCharge: Number(form.perKgCharge) || 0,
  minOrderAmount: Number(form.minOrderAmount) || 0,
  freeShippingThreshold: Number(form.freeShippingThreshold) || 0,
  estimatedDays: { min: Number(form.minDays) || 1, max: Number(form.maxDays) || 1 },
  isActive: form.isActive,
  zones: form.zones
    .split(",")
    .map((z) => z.trim())
    .filter(Boolean)
    .map((z) => {
      const [name, extra] = z.split(":");
      return { name: name.trim(), countries: ["Bangladesh"], additionalCharge: Number(extra) || 0 };
    }),
});
