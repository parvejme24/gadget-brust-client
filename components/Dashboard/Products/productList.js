// sort options and CSV export for the products list
export const sorts = {
  newest: { sortBy: "createdAt", sortOrder: "desc", label: "Newest" },
  "price-desc": { sortBy: "price", sortOrder: "desc", label: "Price: high to low" },
  "price-asc": { sortBy: "price", sortOrder: "asc", label: "Price: low to high" },
  "stock-asc": { sortBy: "stock", sortOrder: "asc", label: "Stock: low first" },
  rating: { sortBy: "star", sortOrder: "desc", label: "Top rated" },
};

export const productsToCSV = (rows) =>
  [
    ["Title", "Category", "Subcategory", "Brand", "Price", "Discount %", "Final price", "Stock", "Rating", "Remark"],
    ...rows.map((p) => [p.title, p.category?.categoryName, p.subcategory, p.brand?.brandName, p.price, p.discount, p.discountPrice, p.stock, p.star, p.remark]),
  ]
    .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
