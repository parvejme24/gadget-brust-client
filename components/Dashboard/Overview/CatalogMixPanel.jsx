import { useAdminCategories, useAdminProductAnalytics } from "@/lib/hooks/useAdmin";
import { BarList, Panel } from "@/components/Dashboard/Kit";

export default function CatalogMixPanel({ className }) {
  const { data: analytics } = useAdminProductAnalytics();
  const { data: categories = [] } = useAdminCategories();
  const name = (id) => categories.find((c) => c._id === id)?.categoryName || "Uncategorised";
  const items = (analytics?.categoryStats || [])
    .map((c) => ({ key: c._id, label: name(c._id), value: c.productCount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <Panel className={className} title="Catalog by category" description="Number of products">
      <BarList items={items} emptyText="No products yet" />
    </Panel>
  );
}
