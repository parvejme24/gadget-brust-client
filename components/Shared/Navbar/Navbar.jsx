"use client";
import React, { useState, useEffect, useRef } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import {
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaShoppingBag,
  FaTachometerAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { useLogout } from "@/lib/hooks/useAuth";
import { logoutUser, setUser } from "@/lib/store/slices/authSlice";
import Swal from "sweetalert2";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // React Query hooks
  const logoutMutation = useLogout();

  // Check if user has token in localStorage (for initial load)
  const [hasToken, setHasToken] = useState(false);
  const [storedUser, setStoredUser] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // implement search functionality here
    }
  };

  // logout handler
  const handleLogout = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#38AD81",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // using react query mutation
        logoutMutation.mutate(undefined, {
          onSuccess: () => {
            // Clear all stored data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");

            // show success message
            Swal.fire({
              title: "Logged Out",
              text: "You have been successfully logged out.",
              icon: "success",
              confirmButtonColor: "#38AD81",
              confirmButtonText: "OK",
              timer: 2000,
              timerProgressBar: true,
            });
            // redirect to home page
            window.location.href = "/";
          },
          onError: (error) => {
            console.error("Logout failed:", error);
            Swal.fire({
              title: "Logout Failed",
              text: "Unable to logout. Please try again.",
              icon: "error",
              confirmButtonColor: "#dc2626",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  };

  // Generate user avatar from full name
  const getUserInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get current user data
  const currentUser = user || storedUser;

  // Load user data from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    // check if user has token and load user data
    setHasToken(!!token);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setStoredUser(parsedUser);
        // If user is not in Redux store but exists in localStorage, dispatch it
        if (!isAuthenticated && parsedUser) {
          dispatch(setUser(parsedUser));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("userData");
      }
    }
  }, [dispatch, isAuthenticated]);

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
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={Logo}
                alt="Gadget Brust Logo"
                width={120}
                height={40}
                className="h-8 w-auto sm:h-9 md:h-10"
              />
            </Link>
          </div>

          {/* search bar - hidden on small, visible on medium and up */}
          <div className="hidden sm:flex flex-1 max-w-lg lg:max-w-2xl mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex w-full border border-gray-300 rounded-lg overflow-hidden">
                {/* category dropdown */}
                <Button
                  variant="ghost"
                  className="cursor-pointer h-10 sm:h-11 md:h-12 px-3 sm:px-4 border-r border-gray-300 rounded-l-lg rounded-r-none hover:bg-gray-50 text-gray-700 font-medium bg-gray-50 text-xs sm:text-sm"
                >
                  All
                </Button>

                {/* search input */}
                <Input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 sm:h-11 md:h-12 border-0 focus:ring-0 rounded-none flex-1 text-sm"
                />

                {/* search button */}
                <Button
                  type="submit"
                  className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 cursor-pointer px-3 sm:px-4 md:px-6 bg-[#5BBB97] hover:bg-[#5BBB97]/90 text-white rounded-l-none rounded-r-lg"
                >
                  <FaSearch className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* right side actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* user account */}
            <div className="relative">
              {isAuthenticated || hasToken ? (
                // User dropdown when logged in
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-[#BFBDBD] cursor-pointer h-8 w-8 sm:h-9 md:h-10 sm:w-9 md:w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50 rounded-md overflow-hidden"
                    >
                      {currentUser?.profileImage?.url ? (
                        <Image
                          src={currentUser.profileImage.url}
                          alt={currentUser.fullName}
                          width={40}
                          height={40}
                          className="cursor-pointer w-full h-full object-cover"
                        />
                      ) : (
                        <div className="cursor-pointer w-full h-full bg-[#38AD81] flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                          {getUserInitials(currentUser?.fullName)}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {/* User Info Header */}
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#38AD81] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getUserInitials(currentUser?.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={currentUser?.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                        className="flex items-center gap-3 cursor-pointer text-sm"
                      >
                        <FaTachometerAlt className="text-[#38AD81] w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href={currentUser?.role === "admin" ? "/admin-dashboard/profile" : "/dashboard/profile"}
                        className="flex items-center gap-3 cursor-pointer text-sm"
                      >
                        <FaEdit className="text-[#38AD81] w-4 h-4" />
                        <span>Edit Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href={currentUser?.role === "admin" ? "/admin-dashboard/orders" : "/dashboard/orders"}
                        className="flex items-center gap-3 cursor-pointer text-sm"
                      >
                        <FaShoppingBag className="text-[#38AD81] w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-3 cursor-pointer text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="text-red-600 w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Login button when not logged in
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-[#BFBDBD] cursor-pointer h-8 w-8 sm:h-9 md:h-10 sm:w-9 md:w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50"
                  >
                    <FiUser className="text-[#343A40] text-base sm:text-lg" />
                  </Button>
                </Link>
              )}
            </div>

            {/* wishlist */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="border border-[#BFBDBD] cursor-pointer h-8 w-8 sm:h-9 md:h-10 sm:w-9 md:w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50"
              >
                <FaRegHeart className="text-[#343A40] text-base sm:text-lg" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
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
                className="border border-[#BFBDBD] cursor-pointer h-8 w-8 sm:h-9 md:h-10 sm:w-9 md:w-10 p-0 text-gray-700 hover:text-[#38AD81] hover:border-[#38AD81] hover:bg-gray-50"
              >
                <BsCart2 className="text-[#343A40] text-base sm:text-lg" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#38AD81] text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* mobile menu with search bar and menu items */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="sm:hidden border-t border-gray-200 py-4 space-y-4"
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
                    className="flex-1 border-0 focus:ring-0 rounded-none h-10 text-sm"
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-[#5BBB97] hover:bg-[#5BBB97]/90 text-white h-10 w-10"
                  >
                    <FaSearch className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* mobile menu items */}
            <div className="space-y-2">
              {isAuthenticated || hasToken ? (
                // Mobile menu for logged in users
                <>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#38AD81] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {getUserInitials(currentUser?.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentUser?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={currentUser?.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                    className="flex items-center gap-3 py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaTachometerAlt className="text-[#38AD81] w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link
                    href={currentUser?.role === "admin" ? "/admin-dashboard/profile" : "/dashboard/profile"}
                    className="flex items-center gap-3 py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaEdit className="text-[#38AD81] w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                  
                  <Link
                    href={currentUser?.role === "admin" ? "/admin-dashboard/orders" : "/dashboard/orders"}
                    className="flex items-center gap-3 py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaShoppingBag className="text-[#38AD81] w-4 h-4" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaRegHeart className="text-[#38AD81] w-4 h-4" />
                    <span>My Wishlist</span>
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center gap-3 py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsCart2 className="text-[#38AD81] w-4 h-4" />
                    <span>Shopping Cart</span>
                  </Link>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 py-2 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 w-full text-left"
                    >
                      <FaSignOutAlt className="text-red-600 w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                // Mobile menu for guests
                <>
                  <Link
                    href="/login"
                    className="block py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Wishlist
                  </Link>
                  <Link
                    href="/cart"
                    className="block py-2 px-3 text-gray-700 hover:text-[#38AD81] hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shopping Cart
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
