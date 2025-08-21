"use client";
import React, { useState, useEffect, useRef } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import Link from "next/link";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // implement search functionality here
    }
  };

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
      }
    };

    // add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // close mobile menu when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemsCount = 3; // replace with actual cart count
  const wishlistItemsCount = 2; // replace with actual wishlist count

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          
          {/* logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src={Logo} 
                alt="Gadget Brust Logo" 
                width={120} 
                height={40} 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex w-full border border-gray-300 rounded-lg overflow-hidden">
                {/* category dropdown */}
                <Button 
                  variant="ghost" 
                  className="cursor-pointer h-12 px-4 border-r border-gray-300 rounded-l-lg rounded-r-none hover:bg-gray-50 text-gray-700 font-medium bg-gray-50"
                >
                  All
                </Button>
                
                {/* search input */}
                <Input 
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-0 focus:ring-0 rounded-none flex-1"
                />
                
                {/* search button */}
                <Button
                  type="submit"
                  className="h-12 w-12 cursor-pointer px-6 bg-[#5BBB97] hover:bg-[#5BBB97]/90 text-white rounded-l-none rounded-r-lg"
                >
                  <FaSearch className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* user account */}
            <div className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="border border-[#BFBDBD] cursor-pointer h-10 w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50"
              >
                <FiUser className="text-[#343A40] text-lg" />
              </Button>
            </div>

            {/* wishlist */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="border border-[#BFBDBD] cursor-pointer h-10 w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50"
              >
                <FaRegHeart className="text-[#343A40] text-lg" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Button>
            </div>

            {/* shopping cart */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="border border-[#BFBDBD] cursor-pointer h-10 w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50"
              >
                <BsCart2 className="text-[#343A40] text-lg" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#38AD81] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </div>

            {/* mobile menu button - toggle between bars and close icon */}
            <Button
              ref={menuButtonRef}
              variant="ghost"
              size="sm"
              className="md:hidden h-10 w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 border border-[#BFBDBD]"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-4 w-4" />
              ) : (
                <FaBars className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* mobile menu with search bar and menu items */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-200 py-4 space-y-4"
          >
            {/* mobile search bar */}
            <div className="pb-4">
              <form onSubmit={handleSearch} className="flex">
                <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
                  <Input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 focus:ring-0 rounded-none h-12"
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-[#5BBB97] hover:bg-[#5BBB97]/90 text-white h-12 w-12"
                  >
                    <FaSearch className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* mobile menu items */}
            <div className="flex flex-col space-y-3">
              <Button
                variant="ghost"
                className="justify-start text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 border border-[#BFBDBD]"
              >
                <FiUser className="mr-3 text-[#343A40] text-lg" />
                My Account
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 border border-[#BFBDBD]"
              >
                <FaRegHeart className="mr-3 text-[#343A40] text-lg" />
                Wishlist ({wishlistItemsCount})
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 border border-[#BFBDBD]"
              >
                <BsCart2 className="mr-3 text-[#343A40] text-lg" />
                Cart ({cartItemsCount})
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
