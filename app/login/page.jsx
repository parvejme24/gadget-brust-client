"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import gadgetsImage from "@/assets/gadgets.svg";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement login logic here
      console.log("Login data:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        {/* Left Column - Form */}
        <div className="space-y-6 p-4 sm:p-6 lg:p-10 w-full max-w-md lg:max-w-[100%] mx-auto lg:mx-0">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4AB58D]">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full cursor-pointer bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm sm:text-base"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Sign in with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500 text-xs sm:text-sm">
                or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full py-3 sm:py-4 lg:py-5 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full py-3 sm:py-4 lg:py-5 pr-12 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} className="sm:w-4 sm:h-4" />
                  ) : (
                    <FaEye size={16} className="sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#38AD81] hover:text-[#38AD81]/80 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-[#38AD81] hover:bg-[#38AD81]/90 text-white font-medium h-10 text-sm sm:text-base"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#38AD81] hover:text-[#38AD81]/80 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:flex justify-center items-center p-4">
          <Image
            src={gadgetsImage}
            alt="Gadgets and technology illustration"
            className="w-full h-auto mt-14"
            priority
          />
        </div>
      </div>
    </div>
  );
}
