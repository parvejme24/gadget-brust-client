"use client"
import Sidebar from "@/components/Shared/Sidebar/Sidebar";
import React, { useState } from "react";
import { 
  FaBell, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaBars,
  FaTimes,
  FaSearch
} from "react-icons/fa";
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdAnalytics, MdSettings, MdLocalShipping } from "react-icons/md";

export default function layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* top navigation bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* left side - menu button and logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GS</span>
                </div>
                <span className="hidden sm:block text-xl font-bold text-gray-900">Gadget Shop</span>
              </div>
            </div>

            {/* center - search bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* right side - notifications and user */}
            <div className="flex items-center space-x-4">
              {/* notifications */}
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 relative">
                <FaBell size={18} />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* user dropdown */}
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">Md Parvej</span>
                </button>

                {/* user dropdown menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Md Parvej</p>
                      <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="mr-3 h-4 w-4" />
                      Profile
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaCog className="mr-3 h-4 w-4" />
                      Settings
                    </a>
                    <div className="border-t border-gray-100">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <FaSignOutAlt className="mr-3 h-4 w-4" />
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* main content area */}
      <div className="flex pt-16">
        {/* sidebar */}
        <Sidebar isOpen={isSidebarOpen} />
        
        {/* main content - with left margin for fixed sidebar on large devices */}
        <div className="flex-1 min-w-0 lg:ml-64">
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
