"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalProducts,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onNextPage,
  onPrevPage,
}) {
  const getVisiblePages = () => {
    if (totalPages <= 4) {
      // Show all pages if 4 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range = [];
    
    // Always show first page
    range.push(1);
    
    if (currentPage <= 3) {
      // Show first 4 pages if current page is near the beginning
      for (let i = 2; i <= Math.min(4, totalPages); i++) {
        range.push(i);
      }
      if (totalPages > 4) {
        range.push("...");
        range.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last 4 pages if current page is near the end
      range.push("...");
      for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Show current page with context
      range.push("...");
      range.push(currentPage - 1);
      range.push(currentPage);
      range.push(currentPage + 1);
      range.push("...");
      range.push(totalPages);
    }
    
    return range;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Products Info */}
      <div className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPages} ({totalProducts} total products)
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <div key={index} className="px-2 py-1">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-9 w-9 p-0 ${
                  currentPage === page
                    ? "bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
