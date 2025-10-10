"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthProfile } from '@/lib/hooks/useAuth';
import { Loader2, User, Mail, Calendar } from 'lucide-react';

export default function AuthTestPage() {
  const { data: userProfile, isLoading, error } = useAuthProfile();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Authentication Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading user profile...</span>
            </div>
          ) : error ? (
            <div className="text-red-600">
              <p><strong>Error:</strong> {error.message}</p>
              <p className="text-sm mt-2">Make sure you are logged in and have a valid token.</p>
            </div>
          ) : userProfile?.data ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span><strong>Email:</strong> {userProfile.data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span><strong>Name:</strong> {userProfile.data.fullName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span><strong>Role:</strong> {userProfile.data.role || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No user profile data available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LocalStorage Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Access Token:</strong> {localStorage.getItem('accessToken') ? 'Present' : 'Not found'}</p>
            <p><strong>User Data:</strong></p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {localStorage.getItem('userData') || 'No user data found'}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Make sure you are logged in to your application</p>
          <p>2. Check if the user profile loads correctly above</p>
          <p>3. If you see user data, the wishlist should work automatically</p>
          <p>4. If not, you may need to log in first</p>
        </CardContent>
      </Card>
    </div>
  );
}

