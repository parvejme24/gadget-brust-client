import CheckoutField from "./CheckoutField";

// name, phone, email and delivery address; errors: { field: message }
export default function ContactFields({ value, onChange, errors = {} }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CheckoutField label="Full name" id="co-name" value={value.name} onChange={set("name")} error={errors.name} autoComplete="name" placeholder="Your full name" />
      <CheckoutField label="Mobile number" id="co-phone" value={value.phone} onChange={set("phone")} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" hint="We'll call to confirm your order" />
      <CheckoutField label="Email (optional)" id="co-email" className="sm:col-span-2" value={value.email} onChange={set("email")} error={errors.email} type="email" autoComplete="email" placeholder="For your order confirmation" />
      <CheckoutField label="Address" id="co-street" className="sm:col-span-2" value={value.street} onChange={set("street")} error={errors.street} autoComplete="street-address" placeholder="House, road, area" />
      <CheckoutField label="City" id="co-city" value={value.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" placeholder="e.g. Dhaka" />
      <div className="grid grid-cols-2 gap-3">
        <CheckoutField label="District" id="co-state" value={value.state} onChange={set("state")} autoComplete="address-level1" />
        <CheckoutField label="Post code" id="co-zip" value={value.zipCode} onChange={set("zipCode")} inputMode="numeric" autoComplete="postal-code" />
      </div>
    </div>
  );
}
