"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicWishlistPage from '../wishlist/page';
import { Heart, User, Database } from 'lucide-react';

export default function WishlistTestPage() {
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [showWishlist, setShowWishlist] = useState(false);

  // Sample emails that might have wishlist data
  const sampleEmails = [
    'test@example.com',
    'customer@example.com',
    'user@example.com',
    'demo@example.com'
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Wishlist Test Page</h1>
      
      {!showWishlist ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Enter Customer Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Customer Email</Label>
                <Input
                  id="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter customer email"
                  type="email"
                />
              </div>
              
              <Button
                onClick={() => setShowWishlist(true)}
                disabled={!customerEmail}
                className="w-full bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
              >
                <Heart className="h-4 w-4 mr-2" />
                View Wishlist
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Quick Test Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Try these sample emails to test the wishlist functionality:
              </p>
              <div className="space-y-2">
                {sampleEmails.map((email) => (
                  <Button
                    key={email}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCustomerEmail(email);
                      setShowWishlist(true);
                    }}
                    className="w-full justify-start text-left"
                  >
                    {email}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Wishlist for: {customerEmail}</h2>
            <Button
              variant="outline"
              onClick={() => setShowWishlist(false)}
            >
              Change Customer
            </Button>
          </div>
          
          <PublicWishlistPage customerEmail={customerEmail} />
        </div>
      )}
    </div>
  );
}