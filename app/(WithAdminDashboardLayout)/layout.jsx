"use client";
import DashboardTopbar from "@/components/Shared/DashboardTopbar/DashboardTopbar.";
import Sidebar from "@/components/Shared/Sidebar/Sidebar";
import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* top navigation bar */}
      <DashboardTopbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        toggleUserDropdown={toggleUserDropdown}
        isUserDropdownOpen={isUserDropdownOpen}
      />

      {/* main content area */}
      <div className="flex pt-16">
        {/* sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* main content - with left margin for fixed sidebar on large devices */}
        <div className="flex-1 min-w-0 lg:ml-64">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {/* overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sonner Toaster for notifications */}
      <Toaster />
    </div>
  );
}
