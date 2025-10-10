"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import gadgetsImage from "@/assets/gadgets.svg";
import { useFirebaseAuth } from "@/lib/providers/AuthProvider";
import { firebaseAuthService } from "@/lib/services/firebaseAuthService";
import { useAppDispatch } from "@/lib/hooks/redux";
import { setUser } from "@/lib/store/slices/authSlice";
import SuccessMessage from "@/components/ui/success-message";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loginWithGoogle, loginWithEmail } = useFirebaseAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await firebaseAuthService.loginWithEmail(formData.email, formData.password);
      console.log("Login successful:", response);

      // Store user data and tokens in localStorage
      const { user, token, refreshToken } = response;
      
      // Store tokens
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Store user data
      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
        // dispatch user data to Redux store
        dispatch(setUser(user));
      }

      // show sweet alert success message
      Swal.fire({
        title: "Welcome Back!",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonColor: "#38AD81",
        confirmButtonText: "Continue to Home",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (
          result.isConfirmed ||
          result.dismiss === Swal.DismissReason.timer
        ) {
          router.push("/");
        }
      });
    } catch (error) {
      console.error("Login failed:", error);

      // show sweet alert error message
      Swal.fire({
        title: "Login Failed",
        text: error.message || "Invalid email or password. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Try Again",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await firebaseAuthService.loginWithGoogle();
      console.log("Google login successful:", response);

      // Store user data and tokens in localStorage
      const { user, token, refreshToken } = response;
      
      // Store tokens
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Store user data
      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
        // dispatch user data to Redux store
        dispatch(setUser(user));
      }

      // show sweet alert success message
      Swal.fire({
        title: "Welcome Back!",
        text: "You have successfully logged in with Google.",
        icon: "success",
        confirmButtonColor: "#38AD81",
        confirmButtonText: "Continue to Home",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (
          result.isConfirmed ||
          result.dismiss === Swal.DismissReason.timer
        ) {
          router.push("/");
        }
      });
    } catch (error) {
      console.error("Google login failed:", error);

      // show sweet alert error message
      Swal.fire({
        title: "Google Login Failed",
        text: error.message || "Unable to login with Google. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Try Again",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
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

          {/* Success Message */}
          {success && (
            <SuccessMessage message={success} onClose={() => setSuccess("")} />
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

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
              disabled={loading}
              className="w-full cursor-pointer bg-[#38AD81] hover:bg-[#38AD81]/90 text-white font-medium h-10 text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
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
