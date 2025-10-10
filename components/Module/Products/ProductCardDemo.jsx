"use client";

import React from "react";
import ProductCard from "./ProductCard";

// Demo component to showcase the updated ProductCard
export default function ProductCardDemo() {
  // Sample product data for demonstration
  const sampleProducts = [
    {
      _id: "1",
      title: "iPhone 15 Pro Max 256GB",
      price: 150000,
      finalPrice: 135000,
      discount: 10,
      stock: 25,
      image: {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
      },
      category: { categoryName: "Smartphones" },
      brand: { brandName: "Apple" }
    },
    {
      _id: "2", 
      title: "Samsung Galaxy S24 Ultra",
      price: 120000,
      finalPrice: 120000,
      discount: 0,
      stock: 5,
      image: {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
      },
      category: { categoryName: "Smartphones" },
      brand: { brandName: "Samsung" }
    },
    {
      _id: "3",
      title: "MacBook Pro 16-inch M3 Pro",
      price: 250000,
      finalPrice: 225000,
      discount: 10,
      stock: 0,
      image: {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
      },
      category: { categoryName: "Laptops" },
      brand: { brandName: "Apple" }
    },
    {
      _id: "4",
      title: "Dell XPS 13 Ultrabook",
      price: 180000,
      finalPrice: 180000,
      discount: 0,
      stock: 15,
      image: {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"
      },
      category: { categoryName: "Laptops" },
      brand: { brandName: "Dell" }
    }
  ];

  const handleEdit = (product) => {
    console.log("Edit product:", product);
    alert(`Edit: ${product.title}`);
  };

  const handleDelete = (product) => {
    console.log("Delete product:", product);
    alert(`Delete: ${product.title}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Updated Product Cards
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Features of Updated Product Card:
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ <strong>Product Title</strong> - Clear, readable title with line clamping</li>
            <li>✅ <strong>Price</strong> - Shows final price (with discount applied if available)</li>
            <li>✅ <strong>Stock Quantity</strong> - Displays exact number of units in stock</li>
            <li>✅ <strong>View Details Button</strong> - Blue button to view product details</li>
            <li>✅ <strong>Edit Button</strong> - Green button for editing products</li>
            <li>✅ <strong>Delete Button</strong> - Red button for deleting products</li>
            <li>✅ <strong>Discount Tag</strong> - Red tag with icon appears on top-left when discount is available</li>
            <li>✅ <strong>Responsive Design</strong> - Works on mobile, tablet, and desktop</li>
            <li>✅ <strong>Stock Status</strong> - Color-coded status (In Stock, Low Stock, Out of Stock)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


