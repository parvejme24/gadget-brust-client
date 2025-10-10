"use client"
import React, { useState } from 'react'
import { useFirebaseAuth } from '@/lib/providers/AuthProvider'
import { firebaseAuthService } from '@/lib/services/firebaseAuthService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Swal from 'sweetalert2'

export default function ProfileUpdate() {
  const { user, updateUserProfile } = useFirebaseAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await firebaseAuthService.updateProfile({
        fullName: formData.fullName,
        profileImage: {
          url: formData.photoURL
        }
      })

      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#38AD81",
        confirmButtonText: "OK"
      })
    } catch (error) {
      Swal.fire({
        title: "Update Failed",
        text: error.message || "Unable to update profile. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Try Again"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    const { value: newPassword } = await Swal.fire({
      title: 'Change Password',
      input: 'password',
      inputLabel: 'New Password',
      inputPlaceholder: 'Enter new password',
      inputAttributes: {
        minlength: 6
      },
      showCancelButton: true,
      confirmButtonColor: "#38AD81",
      cancelButtonColor: "#dc2626"
    })

    if (newPassword) {
      try {
        await firebaseAuthService.changePassword(newPassword)
        Swal.fire({
          title: "Password Changed!",
          text: "Your password has been updated successfully.",
          icon: "success",
          confirmButtonColor: "#38AD81"
        })
      } catch (error) {
        Swal.fire({
          title: "Password Change Failed",
          text: error.message || "Unable to change password. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626"
        })
      }
    }
  }

  if (!user) {
    return <div>Please log in to update your profile.</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#4AB58D] mb-6">Update Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo URL
          </label>
          <Input
            type="url"
            name="photoURL"
            value={formData.photoURL}
            onChange={handleInputChange}
            placeholder="Enter photo URL"
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#38AD81] hover:bg-[#38AD81]/90 text-white"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>

      <div className="mt-4">
        <Button
          onClick={handlePasswordChange}
          variant="outline"
          className="w-full border-[#38AD81] text-[#38AD81] hover:bg-[#38AD81] hover:text-white"
        >
          Change Password
        </Button>
      </div>
    </div>
  )
}



