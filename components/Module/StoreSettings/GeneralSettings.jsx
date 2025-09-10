"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/ui/file-upload';
import { Switch } from '@/components/ui/switch';
import { useUpdateGeneralSettings, useUpdateStoreLogo, useUpdateStoreFavicon } from '@/lib/hooks/useStoreSettings';
import { Loader2, Upload, Image as ImageIcon, Globe } from 'lucide-react';

export default function GeneralSettings({ settings, isLoading }) {
  const [formData, setFormData] = useState({
    storeName: settings?.general?.storeName || '',
    storeDescription: settings?.general?.storeDescription || '',
    storeTagline: settings?.general?.storeTagline || '',
    storeEmail: settings?.general?.storeEmail || '',
    storePhone: settings?.general?.storePhone || '',
    storeAddress: settings?.general?.storeAddress || '',
    storeCity: settings?.general?.storeCity || '',
    storeState: settings?.general?.storeState || '',
    storeCountry: settings?.general?.storeCountry || '',
    storeZipCode: settings?.general?.storeZipCode || '',
    storeWebsite: settings?.general?.storeWebsite || '',
    isMaintenanceMode: settings?.general?.isMaintenanceMode || false,
    allowRegistration: settings?.general?.allowRegistration || true,
    allowGuestCheckout: settings?.general?.allowGuestCheckout || true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  const updateGeneralMutation = useUpdateGeneralSettings();
  const updateLogoMutation = useUpdateStoreLogo();
  const updateFaviconMutation = useUpdateStoreFavicon();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateGeneralMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error updating general settings:', error);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    
    try {
      await updateLogoMutation.mutateAsync(logoFile);
      setLogoFile(null);
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const handleFaviconUpload = async () => {
    if (!faviconFile) return;
    
    try {
      await updateFaviconMutation.mutateAsync(faviconFile);
      setFaviconFile(null);
    } catch (error) {
      console.error('Error uploading favicon:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                placeholder="Enter store name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeTagline">Store Tagline</Label>
              <Input
                id="storeTagline"
                value={formData.storeTagline}
                onChange={(e) => handleInputChange('storeTagline', e.target.value)}
                placeholder="Enter store tagline"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeDescription">Store Description</Label>
            <Textarea
              id="storeDescription"
              value={formData.storeDescription}
              onChange={(e) => handleInputChange('storeDescription', e.target.value)}
              placeholder="Describe your store..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email *</Label>
              <Input
                id="storeEmail"
                type="email"
                value={formData.storeEmail}
                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                placeholder="store@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={formData.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeWebsite">Store Website</Label>
            <Input
              id="storeWebsite"
              value={formData.storeWebsite}
              onChange={(e) => handleInputChange('storeWebsite', e.target.value)}
              placeholder="https://yourstore.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Store Address */}
      <Card>
        <CardHeader>
          <CardTitle>Store Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeAddress">Address</Label>
            <Textarea
              id="storeAddress"
              value={formData.storeAddress}
              onChange={(e) => handleInputChange('storeAddress', e.target.value)}
              placeholder="Enter store address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeCity">City</Label>
              <Input
                id="storeCity"
                value={formData.storeCity}
                onChange={(e) => handleInputChange('storeCity', e.target.value)}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeState">State</Label>
              <Input
                id="storeState"
                value={formData.storeState}
                onChange={(e) => handleInputChange('storeState', e.target.value)}
                placeholder="Enter state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeZipCode">Zip Code</Label>
              <Input
                id="storeZipCode"
                value={formData.storeZipCode}
                onChange={(e) => handleInputChange('storeZipCode', e.target.value)}
                placeholder="Enter zip code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeCountry">Country</Label>
            <Input
              id="storeCountry"
              value={formData.storeCountry}
              onChange={(e) => handleInputChange('storeCountry', e.target.value)}
              placeholder="Enter country"
            />
          </div>
        </CardContent>
      </Card>

      {/* Store Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Store Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Store Logo</Label>
              <div className="flex items-center gap-4">
                {settings?.general?.logoUrl && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={settings.general.logoUrl}
                      alt="Current logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <FileUpload
                    onFileChange={setLogoFile}
                    accept="image/*"
                    preview={logoFile ? URL.createObjectURL(logoFile) : null}
                  />
                  {logoFile && (
                    <div className="mt-2">
                      <Button
                        onClick={handleLogoUpload}
                        disabled={updateLogoMutation.isPending}
                        size="sm"
                      >
                        {updateLogoMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Logo
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Store Favicon</Label>
              <div className="flex items-center gap-4">
                {settings?.general?.faviconUrl && (
                  <div className="w-12 h-12 border rounded-lg overflow-hidden">
                    <img
                      src={settings.general.faviconUrl}
                      alt="Current favicon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <FileUpload
                    onFileChange={setFaviconFile}
                    accept="image/*"
                    preview={faviconFile ? URL.createObjectURL(faviconFile) : null}
                  />
                  {faviconFile && (
                    <div className="mt-2">
                      <Button
                        onClick={handleFaviconUpload}
                        disabled={updateFaviconMutation.isPending}
                        size="sm"
                      >
                        {updateFaviconMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Favicon
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Options */}
      <Card>
        <CardHeader>
          <CardTitle>Store Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className="text-sm text-gray-600">
                Enable maintenance mode to temporarily disable your store
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={formData.isMaintenanceMode}
              onCheckedChange={(checked) => handleInputChange('isMaintenanceMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="allowRegistration">Allow User Registration</Label>
              <p className="text-sm text-gray-600">
                Allow new users to register accounts
              </p>
            </div>
            <Switch
              id="allowRegistration"
              checked={formData.allowRegistration}
              onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="allowGuestCheckout">Allow Guest Checkout</Label>
              <p className="text-sm text-gray-600">
                Allow customers to checkout without creating an account
              </p>
            </div>
            <Switch
              id="allowGuestCheckout"
              checked={formData.allowGuestCheckout}
              onCheckedChange={(checked) => handleInputChange('allowGuestCheckout', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updateGeneralMutation.isPending}
          className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {updateGeneralMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save General Settings
        </Button>
      </div>
    </div>
  );
}
