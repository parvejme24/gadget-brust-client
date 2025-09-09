"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaUser, FaEdit, FaSave, FaTimes, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { setUser } from "@/lib/store/slices/authSlice";
import Swal from "sweetalert2";

export default function AdminProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data to original user data
      setFormData({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        bio: user?.bio || "",
      });
    }
  };

  // Handle save changes
  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    // For now, we'll just update the local state and localStorage
    
    const updatedUser = {
      ...user,
      ...formData
    };

    // Update Redux store
    dispatch(setUser(updatedUser));

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }

    setIsEditing(false);

    Swal.fire({
      title: "Profile Updated",
      text: "Your profile has been successfully updated.",
      icon: "success",
      confirmButtonColor: "#38AD81",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Generate user avatar from full name
  const getUserInitials = (fullName) => {
    if (!fullName) return "A";
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and profile information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block">
                  {user?.profileImage?.url ? (
                    <Image
                      src={user.profileImage.url}
                      alt={user.fullName}
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-30 h-30 bg-[#38AD81] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-white font-bold text-3xl">
                        {getUserInitials(user?.fullName)}
                      </span>
                    </div>
                  )}
                  
                  {/* Camera Icon */}
                  <button className="absolute bottom-2 right-2 bg-[#38AD81] text-white p-2 rounded-full shadow-lg hover:bg-[#2d8f6a] transition-colors">
                    <FaCamera size={16} />
                  </button>
                </div>

                {/* User Info */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user?.fullName || "Admin User"}
                  </h2>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 mt-2">
                    Admin
                  </span>
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleEditToggle}
                  className={`mt-6 w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                    isEditing
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-[#38AD81] text-white hover:bg-[#2d8f6a]"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <FaTimes className="mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-[#38AD81] text-white rounded-md hover:bg-[#2d8f6a] transition-colors"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#38AD81] focus:border-[#38AD81]"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.fullName || "Not provided"}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#38AD81] focus:border-[#38AD81]"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email || "Not provided"}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#38AD81] focus:border-[#38AD81]"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || "Not provided"}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#38AD81] focus:border-[#38AD81]"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.address || "Not provided"}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#38AD81] focus:border-[#38AD81]"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.bio || "No bio provided"}</p>
                  )}
                </div>

                {/* Account Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaCalendarAlt className="inline mr-2" />
                        Member Since
                      </label>
                      <p className="text-gray-600">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <p className="text-gray-600 capitalize">{user?.role || "Admin"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}