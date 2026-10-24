import { PageHeader } from "@/components/Dashboard/Kit";
import NewOrderForm from "@/components/Dashboard/Orders/NewOrderForm";

export default function NewOrderPage() {
  return (
    <>
      <PageHeader title="New order" description="Add a phone or WhatsApp order. It starts as pending, like a storefront order." back={{ href: "/dashboard/orders", label: "Orders" }} />
      <NewOrderForm />
    </>
  );
}
