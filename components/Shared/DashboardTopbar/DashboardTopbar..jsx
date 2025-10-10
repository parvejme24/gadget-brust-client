import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaTimes,
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaShoppingBag,
  FaEdit,
} from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { useLogout, useAuthProfile } from "@/lib/hooks/useAuth";
import { logoutUser, setUser } from "@/lib/store/slices/authSlice";
import { useFirebaseAuth } from "@/lib/providers/AuthProvider";
import Swal from "sweetalert2";

import logo from "@/assets/logo.svg";

export default function DashboardTopbar({
  toggleSidebar,
  isSidebarOpen,
  toggleUserDropdown,
  isUserDropdownOpen,
}) {
  // Firebase Auth
  const { user: firebaseUser, loading: firebaseLoading, logout: firebaseLogout } = useFirebaseAuth();
  
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // React Query hooks
  const logoutMutation = useLogout();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useAuthProfile();
  
  // Check if user has token in localStorage (for initial load)
  const [hasToken, setHasToken] = useState(false);
  const [storedUser, setStoredUser] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    console.log('Loading from localStorage:', { token: !!token, userData });

    // check if user has token and load user data
    setHasToken(!!token);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user data:', parsedUser);
        setStoredUser(parsedUser);
        // If user is not in Redux store but exists in localStorage, dispatch it
        if (!isAuthenticated && parsedUser) {
          console.log('Dispatching user to Redux store');
          dispatch(setUser(parsedUser));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("userData");
      }
    } else {
      console.log('No user data found in localStorage');
    }
  }, [dispatch, isAuthenticated]);

  // Update Redux store with fresh profile data when available
  useEffect(() => {
    console.log('Profile data effect:', { profileData, profileLoading, profileError });
    if (profileData && !profileLoading && !profileError) {
      console.log('Updating with fresh profile data:', profileData);
      dispatch(setUser(profileData));
      // Also update localStorage with fresh data
      if (typeof window !== 'undefined') {
        localStorage.setItem("userData", JSON.stringify(profileData));
      }
    }
  }, [profileData, profileLoading, profileError, dispatch]);

  // logout handler
  const handleLogout = async () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#38AD81",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Use Firebase logout if available, otherwise use React Query mutation
          if (firebaseUser && firebaseLogout) {
            await firebaseLogout();
          } else {
            // Fallback to React Query mutation
            await logoutMutation.mutateAsync();
          }
          
          // Clear all stored data
          if (typeof window !== 'undefined') {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
          }
          
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
        } catch (error) {
          console.error("Logout failed:", error);
          Swal.fire({
            title: "Logout Failed",
            text: "Unable to logout. Please try again.",
            icon: "error",
            confirmButtonColor: "#dc2626",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  // Generate user avatar from full name
  const getUserInitials = (user) => {
    if (!user) return "A";
    const name = user.displayName || user.fullName || user.name || user.username || user.email || "Admin";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get current user data - prioritize Firebase user, then fresh profile data, then Redux store, then localStorage
  const currentUser = firebaseUser || profileData || user || storedUser;
  
  // Debug logging
  console.log('DashboardTopbar Debug:', {
    firebaseUser,
    firebaseLoading,
    profileData,
    profileLoading,
    profileError,
    user,
    storedUser,
    currentUser,
    isAuthenticated,
    hasToken
  });
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* left side - menu button and logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#38AD81]"
            >
              {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            <div className="flex items-center space-x-2">
              <Image src={logo} alt="Gadget Shop Logo" width={32} height={32} />
              <span className="hidden sm:block text-lg font-semibold text-gray-900">Admin Panel</span>
            </div>
          </div>

          {/* center - search bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, customers, orders..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#38AD81] focus:border-[#38AD81] sm:text-sm"
              />
            </div>
          </div>

          {/* right side - notifications and user */}
          <div className="flex items-center space-x-4">
            {/* notifications */}
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#38AD81] relative">
              <FaBell size={18} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* user dropdown */}
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#38AD81]"
              >
                {currentUser?.photoURL || currentUser?.profileImage?.url ? (
                  <Image
                    src={currentUser.photoURL || currentUser.profileImage.url}
                    alt={currentUser.displayName || currentUser.fullName}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#38AD81] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials(currentUser)}
                    </span>
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {(firebaseLoading || profileLoading) ? "Loading..." : (currentUser?.displayName || currentUser?.fullName || currentUser?.name || currentUser?.username || "Admin User")}
                </span>
              </button>

              {/* user dropdown menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {currentUser?.photoURL || currentUser?.profileImage?.url ? (
                        <Image
                          src={currentUser.photoURL || currentUser.profileImage.url}
                          alt={currentUser.displayName || currentUser.fullName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#38AD81] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {getUserInitials(currentUser)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {(firebaseLoading || profileLoading) ? "Loading..." : (currentUser?.displayName || currentUser?.fullName || currentUser?.name || currentUser?.username || "Admin User")}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {(firebaseLoading || profileLoading) ? "Loading..." : (currentUser?.email || currentUser?.emailAddress || "admin@example.com")}
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          Admin
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleUserDropdown}
                  >
                    <FaTachometerAlt className="mr-3 h-4 w-4 text-[#38AD81]" />
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/admin-profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleUserDropdown}
                  >
                    <FaUser className="mr-3 h-4 w-4 text-[#38AD81]" />
                    Profile
                  </Link>
                  
                  <Link
                    href="/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleUserDropdown}
                  >
                    <FaShoppingBag className="mr-3 h-4 w-4 text-[#38AD81]" />
                    Orders
                  </Link>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        toggleUserDropdown();
                        handleLogout();
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
