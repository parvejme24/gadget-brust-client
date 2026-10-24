"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { useShopCart } from "@/lib/hooks/useShop";
import { useShippingMethods } from "@/lib/hooks/useStorefront";
import { useSession } from "@/lib/hooks/useSession";
import { useAddresses } from "@/lib/hooks/useAccount";
import { checkoutService } from "@/lib/services/checkoutService";
import PageHero from "@/components/Module/Shop/PageHero";
import CheckoutSection from "./CheckoutSection";
import ContactFields from "./ContactFields";
import DeliveryOptions from "./DeliveryOptions";
import CheckoutField from "./CheckoutField";
import CheckoutSummary from "./CheckoutSummary";
import SavedAddresses from "./SavedAddresses";

const CONTACT_KEY = "gbCheckoutContact";
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;
const emptyContact = { name: "", phone: "", email: "", street: "", city: "", state: "", zipCode: "" };

const validate = (c) => {
  const errors = {};
  if (!c.name.trim()) errors.name = "Enter your full name";
  if (!BD_PHONE.test(c.phone.replace(/[\s-]/g, ""))) errors.phone = "Enter a valid mobile number (01XXXXXXXXX)";
  if (c.email.trim() && !/^\S+@\S+\.\S+$/.test(c.email.trim())) errors.email = "Enter a valid email";
  if (!c.street.trim()) errors.street = "Enter your delivery address";
  if (!c.city.trim()) errors.city = "Enter your city";
  return errors;
};

const errorText = (e) => e?.response?.data?.message || "Something went wrong. Please try again.";

export default function CheckoutView() {
  const router = useRouter();
  const cart = useShopCart();
  const { user } = useSession();
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const isCustomer = user?.role === "user";
  const { data: addresses = [] } = useAddresses({ enabled: isCustomer });
  const [saveAddress, setSaveAddress] = useState(true);

  // returning guests get their last details back; signed-in customers get their name and email
  useEffect(() => {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}");
    } catch {
      // storage blocked
    }
    setContact((c) => ({ ...c, ...saved, ...(user && { name: saved.name || user.fullName || "", email: saved.email || user.email || "" }) }));
  }, [user]);

  // signed-in customers start from their default saved address
  const [usedDefault, setUsedDefault] = useState(false);
  useEffect(() => {
    const preferred = addresses.find((a) => a.isDefault) || addresses[0];
    if (usedDefault || !preferred) return;
    setUsedDefault(true);
    setContact((c) => ({ ...c, name: preferred.name, phone: preferred.phone, street: preferred.street, city: preferred.city, zipCode: preferred.zipCode || "" }));
  }, [addresses, usedDefault]);

  const pickAddress = (a) => updateContact({ ...contact, name: a.name, phone: a.phone, street: a.street, city: a.city, zipCode: a.zipCode || "" });
  const isSaved = addresses.some(
    (a) => a.street.trim().toLowerCase() === contact.street.trim().toLowerCase() && a.city.trim().toLowerCase() === contact.city.trim().toLowerCase()
  );

  const { data: methods = [], isLoading: methodsLoading } = useShippingMethods();
  useEffect(() => {
    if (!shippingMethod && methods[0]) setShippingMethod(methods[0]._id);
  }, [methods, shippingMethod]);

  const items = useMemo(() => cart.items.map((i) => ({ product: i._id, qty: i.qty })), [cart.items]);
  const quote = useQuery({
    queryKey: ["checkout-quote", items, shippingMethod, coupon],
    queryFn: () => checkoutService.quote({ items, shippingMethod, couponCode: coupon || undefined }),
    enabled: items.length > 0 && !!shippingMethod,
    retry: false,
    placeholderData: (prev) => prev,
  });

  // a refused coupon is dropped so the rest of the order still prices
  useEffect(() => {
    if (quote.isError && coupon) {
      setCouponError(errorText(quote.error));
      setCoupon("");
    }
  }, [quote.isError, quote.error, coupon]);

  const place = useMutation({
    mutationFn: checkoutService.placeOrder,
    onSuccess: (order) => {
      try {
        const { name, phone, email, street, city, state, zipCode } = contact;
        localStorage.setItem(CONTACT_KEY, JSON.stringify({ name, phone, email, street, city, state, zipCode }));
        sessionStorage.setItem("gbLastOrder", JSON.stringify({ number: order.invoiceNumber, phone: order.phone, total: order.total, isGuest: order.isGuest }));
      } catch {
        // storage blocked: the success page still shows the order number
      }
      cart.clear();
      router.push(`/checkout/success?number=${encodeURIComponent(order.invoiceNumber)}`);
    },
    onError: (e) => toast.error(errorText(e)),
  });

  // editing a field clears its error
  const updateContact = (next) => {
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([key]) => next[key] === contact[key])));
    setContact(next);
  };

  const submit = () => {
    const found = validate(contact);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Please check your delivery details");
      document.getElementById(`co-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    place.mutate({
      customer: { name: contact.name.trim(), phone: contact.phone.replace(/[\s-]/g, ""), email: contact.email.trim() },
      shippingAddress: { street: contact.street.trim(), city: contact.city.trim(), state: contact.state.trim(), zipCode: contact.zipCode.trim(), country: "Bangladesh" },
      shippingMethod,
      items,
      couponCode: coupon || undefined,
      notes: notes.trim(),
      saveAddress: isCustomer && !isSaved && saveAddress,
    });
  };

  if (!cart.hydrated) return <div className="min-h-[60vh]" />;

  if (!cart.items.length) {
    return (
      <div className="pb-16">
        <PageHero title="Checkout" crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <div className="container mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light"><ShoppingBag className="h-9 w-9 text-brand" /></span>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Add a few products, then come back to check out.</p>
          <Link href="/products" className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <PageHero
        title="Checkout"
        subtitle={user ? `Signed in as ${user.email}. This order will appear in your account.` : "Checkout as a guest. No account needed."}
        crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      >
        {!user && (
          <Link href="/login?redirect=/checkout" className="text-sm font-semibold text-brand hover:underline">
            Have an account? Sign in
          </Link>
        )}
      </PageHero>

      <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          <div className="min-w-0 space-y-6">
            <CheckoutSection step={1} title="Contact & address" description="Where should we deliver?">
              {isCustomer && <SavedAddresses addresses={addresses} contact={contact} onPick={pickAddress} />}
              <ContactFields value={contact} onChange={updateContact} errors={errors} />
              {isCustomer && !isSaved && contact.street.trim() && (
                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                  Save this address to my account
                </label>
              )}
            </CheckoutSection>
            <CheckoutSection step={2} title="Delivery" description="Choose how fast you want it">
              <DeliveryOptions methods={methods} value={shippingMethod} onChange={setShippingMethod} subtotal={cart.subtotal} loading={methodsLoading} />
              <CheckoutField as="textarea" rows={3} label="Note for the delivery (optional)" id="co-notes" className="mt-5" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Landmark, best time to call…" />
            </CheckoutSection>
          </div>

          <CheckoutSummary
            items={cart.items}
            quote={quote.data}
            quoting={quote.isFetching}
            quoteError={quote.isError && !coupon ? errorText(quote.error) : ""}
            coupon={coupon}
            couponError={couponError}
            onApplyCoupon={(code) => {
              setCouponError("");
              setCoupon(code);
            }}
            onRemoveCoupon={() => setCoupon("")}
            placing={place.isPending}
            onPlace={submit}
            canPlace={!!shippingMethod && !!quote.data && !quote.isError}
          />
        </div>
      </div>
    </div>
  );
}
