"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWishlistByEmail } from '@/lib/hooks/useWishlist';
import { Loader2, Database, AlertTriangle, CheckCircle } from 'lucide-react';

export default function WishlistDebugPage() {
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const { data, isLoading, error, refetch } = useWishlistByEmail(testEmail);

  const handleTest = async () => {
    if (testEmail) {
      setIsTesting(true);
      try {
        await refetch();
      } finally {
        setIsTesting(false);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Wishlist Debug Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Test Wishlist API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testEmail">Customer Email</Label>
            <Input
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter customer email to test"
              type="email"
            />
          </div>
          
          <Button
            onClick={handleTest}
            disabled={!testEmail || isLoading}
            className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testing...
              </>
            ) : (
              'Test API'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>API Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : error ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <div className="bg-red-50 p-3 rounded text-sm">
                <p><strong>Message:</strong> {error.message}</p>
                <p><strong>Status:</strong> {error.response?.status}</p>
                <p><strong>URL:</strong> {error.config?.url}</p>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Success</span>
              </div>
              <div className="bg-green-50 p-3 rounded text-sm">
                <p><strong>Status:</strong> {data.status}</p>
                <p><strong>Message:</strong> {data.message}</p>
                <p><strong>Items Count:</strong> {data.data?.length || 0}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data yet. Enter an email and click "Test API".</p>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. Enter a customer email that has wishlist items in your database</p>
          <p>2. Click "Test API" to make the API call</p>
          <p>3. Check the results to see if the API is working correctly</p>
          <p>4. If you see an error, check:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Is your backend server running?</li>
            <li>Is the API endpoint correct?</li>
            <li>Does the customer email exist in your database?</li>
            <li>Are there any CORS issues?</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

