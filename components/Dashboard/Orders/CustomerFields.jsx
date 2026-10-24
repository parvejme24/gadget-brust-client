import { Field, inputClass } from "@/components/Dashboard/Kit";

export const emptyContact = { name: "", phone: "", email: "", street: "", city: "", state: "", zipCode: "" };

export const contactFromOrder = (o) => ({
  name: o.customer?.name || o.user_id?.fullName || "",
  phone: o.phone || o.customer?.phone || "",
  email: o.customer?.email || o.user_id?.email || "",
  street: o.shippingAddress?.street || "",
  city: o.shippingAddress?.city || "",
  state: o.shippingAddress?.state || "",
  zipCode: o.shippingAddress?.zipCode || "",
});

export const contactPayload = (c) => ({
  customer: { name: c.name.trim(), phone: c.phone.trim(), email: c.email.trim() },
  shippingAddress: { street: c.street.trim(), city: c.city.trim(), state: c.state.trim(), zipCode: c.zipCode.trim(), country: "Bangladesh" },
});

// name, phone, email and delivery address
export default function CustomerFields({ value, onChange, idPrefix = "cf" }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  const id = (key) => `${idPrefix}-${key}`;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" htmlFor={id("name")}>
        <input id={id("name")} value={value.name} onChange={set("name")} autoComplete="name" className={inputClass} />
      </Field>
      <Field label="Mobile number" htmlFor={id("phone")} hint="01XXXXXXXXX">
        <input id={id("phone")} value={value.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" className={inputClass} />
      </Field>
      <Field label="Email (optional)" htmlFor={id("email")} className="sm:col-span-2">
        <input id={id("email")} type="email" value={value.email} onChange={set("email")} autoComplete="email" className={inputClass} />
      </Field>
      <Field label="Address" htmlFor={id("street")} className="sm:col-span-2">
        <input id={id("street")} value={value.street} onChange={set("street")} placeholder="House, road, area" autoComplete="street-address" className={inputClass} />
      </Field>
      <Field label="City" htmlFor={id("city")}>
        <input id={id("city")} value={value.city} onChange={set("city")} autoComplete="address-level2" className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="District" htmlFor={id("state")}>
          <input id={id("state")} value={value.state} onChange={set("state")} className={inputClass} />
        </Field>
        <Field label="Post code" htmlFor={id("zip")}>
          <input id={id("zip")} value={value.zipCode} onChange={set("zipCode")} inputMode="numeric" className={inputClass} />
        </Field>
      </div>
    </div>
  );
}
