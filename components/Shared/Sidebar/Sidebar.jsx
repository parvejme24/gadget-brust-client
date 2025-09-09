import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  MdBrandingWatermark,
} from "react-icons/md";
import logo from "@/assets/logo.svg";

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      name: "Products",
      icon: <MdInventory className="w-5 h-5" />,
      href: "/products",
    },
    {
      name: "Categories",
      icon: <MdCategory className="w-5 h-5" />,
      href: "/categories",
    },
    {
      name: "Brands",
      icon: <MdBrandingWatermark className="w-5 h-5" />,
      href: "/brands",
    },
    {
      name: "Orders",
      icon: <MdShoppingCart className="w-5 h-5" />,
      href: "/orders",
    },
    {
      name: "Customers",
      icon: <MdPeople className="w-5 h-5" />,
      href: "/customers",
    },
    {
      name: "Analytics",
      icon: <MdAnalytics className="w-5 h-5" />,
      href: "/analytics",
    },
    {
      name: "Reports",
      icon: <MdReport className="w-5 h-5" />,
      href: "/reports",
    },
    {
      name: "Shipping",
      icon: <MdLocalShipping className="w-5 h-5" />,
      href: "/shipping",
    },
    {
      name: "Payments",
      icon: <MdPayment className="w-5 h-5" />,
      href: "/payments",
    },
    {
      name: "Store Settings",
      icon: <MdStore className="w-5 h-5" />,
      href: "/store-settings",
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
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#38AD81] text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`mr-3 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
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
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#38AD81] text-white'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`mr-3 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
