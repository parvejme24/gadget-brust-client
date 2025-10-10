"use client";

import React from 'react';

export default function SimpleWishlistTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Wishlist Test</h1>
      <p className="text-green-600 font-medium">
        ✅ This page is working correctly!
      </p>
      <p className="text-gray-600 mt-2">
        If you can see this message, the routing is working.
      </p>
      <p className="text-sm text-gray-400 mt-4">
        Current time: {new Date().toLocaleString()}
      </p>
    </div>
  );
}

