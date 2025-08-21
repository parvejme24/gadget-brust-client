"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";

export default function NavItemsBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedItems, setMobileExpandedItems] = useState(new Set());
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // navigation items with dropdown data
  const navItems = [
    { name: "Home", href: "/", hasDropdown: false },
    {
      name: "Laptop & Computers",
      href: "/laptops-computers",
      hasDropdown: true,
      dropdownItems: [
        { name: "Laptops", href: "/laptops" },
        { name: "Desktop Computers", href: "/desktops" },
        { name: "Gaming PCs", href: "/gaming-pcs" },
        { name: "Accessories", href: "/computer-accessories" },
      ],
    },
    {
      name: "Audio & Sound",
      href: "/audio-sound",
      hasDropdown: true,
      dropdownItems: [
        { name: "Headphones", href: "/headphones" },
        { name: "Speakers", href: "/speakers" },
        { name: "Microphones", href: "/microphones" },
        { name: "Audio Systems", href: "/audio-systems" },
      ],
    },
    {
      name: "Smartphone & Tablets",
      href: "/smartphones-tablets",
      hasDropdown: true,
      dropdownItems: [
        { name: "Smartphones", href: "/smartphones" },
        { name: "Tablets", href: "/tablets" },
        { name: "Phone Cases", href: "/phone-cases" },
        { name: "Chargers", href: "/chargers" },
      ],
    },
    {
      name: "Camera",
      href: "/cameras",
      hasDropdown: true,
      dropdownItems: [
        { name: "DSLR Cameras", href: "/dslr-cameras" },
        { name: "Mirrorless Cameras", href: "/mirrorless-cameras" },
        { name: "Action Cameras", href: "/action-cameras" },
        { name: "Camera Lenses", href: "/camera-lenses" },
      ],
    },
    {
      name: "SmartWatch",
      href: "/smartwatches",
      hasDropdown: true,
      dropdownItems: [
        { name: "Fitness Trackers", href: "/fitness-trackers" },
        { name: "Smart Watches", href: "/smart-watches" },
        { name: "Wearable Tech", href: "/wearable-tech" },
      ],
    },
    { name: "Contact", href: "/contact", hasDropdown: false },
  ];

  // close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setMobileExpandedItems(new Set());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // close mobile menu when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setMobileExpandedItems(new Set());
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobileMenuOpen]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setMobileExpandedItems(new Set());
    }
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const toggleMobileItem = (index) => {
    setMobileExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[#38AD81] relative z-40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* desktop navigation - hidden on small and medium, visible on large and up */}
        <nav className="hidden lg:block">
          <ul className="flex justify-center items-center text-white gap-6 py-3">
            {navItems.map((item, index) => (
              <li key={index} className="relative">
                <button
                  onClick={() =>
                    item.hasDropdown ? toggleDropdown(index) : null
                  }
                  className="flex items-center gap-1 py-2 px-3 hover:text-gray-200 transition-colors duration-200 font-medium"
                >
                  {item.hasDropdown ? (
                    <>
                      <span className="whitespace-nowrap">{item.name}</span>
                      <IoIosArrowDown
                        className={`text-sm transition-transform duration-200 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-gray-200 transition-colors duration-200 whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                  )}
                </button>

                {/* dropdown menu */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200 z-50">
                    <div className="py-2">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 transition-colors duration-200 text-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* mobile navigation - visible on small and medium devices */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-3">
            <span className="text-white font-medium text-sm">Menu</span>
            <button
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-1"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* dropdown system that appears when three-line icon is clicked */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50"
            >
              <div className="py-2">
                {navItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0">
                    {item.hasDropdown ? (
                      <div>
                        {/* dropdown trigger */}
                        <button
                          onClick={() => toggleMobileItem(index)}
                          className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                        >
                          <span>{item.name}</span>
                          <IoIosArrowDown
                            className={`text-sm transition-transform duration-200 ${
                              mobileExpandedItems.has(index) ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* dropdown items */}
                        {mobileExpandedItems.has(index) && (
                          <div className="bg-gray-50 border-t border-gray-100">
                            {item.dropdownItems.map(
                              (dropdownItem, dropdownIndex) => (
                                <Link
                                  key={dropdownIndex}
                                  href={dropdownItem.href}
                                  className="block py-2.5 px-8 text-gray-600 hover:text-[#38AD81] hover:bg-gray-100 transition-colors duration-200 text-sm"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setMobileExpandedItems(new Set());
                                  }}
                                >
                                  {dropdownItem.name}
                                </Link>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 px-4 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
