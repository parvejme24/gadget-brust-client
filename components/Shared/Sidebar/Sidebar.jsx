import React from "react";
import Image from "next/image";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdAnalytics,
  MdSettings,
  MdLocalShipping,
  MdCategory,
  MdPayment,
  MdReport,
  MdStore,
  MdTrendingUp,
  MdBrandingWatermark,
} from "react-icons/md";
import { FaHome, FaBoxes, FaUsers, FaChartBar } from "react-icons/fa";
import logo from "@/assets/logo.svg";

export default function Sidebar({ isOpen }) {
  const navigationItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      href: "/dashboard",
      badge: null,
    },
    {
      name: "Products",
      icon: <MdInventory className="w-5 h-5" />,
      href: "/products",
      badge: "24",
    },
    {
      name: "Categories",
      icon: <MdCategory className="w-5 h-5" />,
      href: "/categories",
      badge: null,
    },
    {
      name: "Brands",
      icon: <MdBrandingWatermark className="w-5 h-5" />,
      href: "/brands",
      badge: "5",
    },
    {
      name: "Orders",
      icon: <MdShoppingCart className="w-5 h-5" />,
      href: "/orders",
      badge: "12",
    },
    {
      name: "Customers",
      icon: <MdPeople className="w-5 h-5" />,
      href: "/customers",
      badge: "156",
    },
    {
      name: "Analytics",
      icon: <MdAnalytics className="w-5 h-5" />,
      href: "/analytics",
      badge: null,
    },
    {
      name: "Reports",
      icon: <MdReport className="w-5 h-5" />,
      href: "/reports",
      badge: null,
    },
    {
      name: "Shipping",
      icon: <MdLocalShipping className="w-5 h-5" />,
      href: "/shipping",
      badge: "8",
    },
    {
      name: "Payments",
      icon: <MdPayment className="w-5 h-5" />,
      href: "/payments",
      badge: null,
    },
    {
      name: "Store Settings",
      icon: <MdStore className="w-5 h-5" />,
      href: "/store-settings",
      badge: null,
    },
  ];

  const quickStats = [
    {
      name: "Total Sales",
      value: "$12,450",
      change: "+12%",
      trend: "up",
      icon: <MdTrendingUp className="w-4 h-4 text-green-500" />,
    },
    {
      name: "Orders",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: <MdShoppingCart className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <>
      {/* desktop sidebar - fixed for large devices */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64">
        <div className="flex flex-col h-full">
                      <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
              {/* logo section */}
              <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200">
                <Image src={logo} alt="Gadget Shop Logo" width={120} height={40} className="h-8 w-auto" />
              </div>

              {/* navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="mr-3 text-gray-400 group-hover:text-gray-500">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </nav>

              {/* quick stats */}
              <div className="border-t border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  {quickStats.map((stat) => (
                    <div
                      key={stat.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {stat.icon}
                        <span className="text-sm text-gray-600">
                          {stat.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-xs text-green-600">
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* mobile header */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200">
            <Image src={logo} alt="Gadget Shop Logo" width={120} height={40} className="h-8 w-auto" />
          </div>

          {/* mobile navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="px-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="mr-3 text-gray-400 group-hover:text-gray-500">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
