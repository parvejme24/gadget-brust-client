"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useUpdateProfile } from "@/lib/hooks/useAuth";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData, {
      onSuccess: (data) => {
        Swal.fire({
          title: 'Profile Updated!',
          text: 'Your profile has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#38AD81',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        });
        setIsEditing(false);
      },
      onError: (error) => {
        Swal.fire({
          title: 'Update Failed',
          text: error.message || 'Unable to update profile. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'Try Again',
        });
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-[#38AD81] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-white text-3xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {user?.fullName || "User"}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaCalendarAlt className="text-[#38AD81]" />
                <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FaEdit className="text-[#38AD81]" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="flex items-center gap-2 bg-[#38AD81] hover:bg-[#2d8a6b]"
                      disabled={updateProfileMutation.isPending}
                    >
                      <FaSave />
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <FaTimes />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaUser className="text-[#38AD81]" />
                      <span className="text-gray-900">{user?.fullName || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaEnvelope className="text-[#38AD81]" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Role
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <div className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-gray-900 capitalize">{user?.role || "user"}</span>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-900">Active</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

