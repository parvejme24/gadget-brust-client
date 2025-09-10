"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateContactInfo } from '@/lib/hooks/useStoreSettings';
import { Loader2, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactSettings({ settings, isLoading }) {
  const [formData, setFormData] = useState({
    supportEmail: settings?.contact?.supportEmail || '',
    supportPhone: settings?.contact?.supportPhone || '',
    salesEmail: settings?.contact?.salesEmail || '',
    salesPhone: settings?.contact?.salesPhone || '',
    billingEmail: settings?.contact?.billingEmail || '',
    billingPhone: settings?.contact?.billingPhone || '',
    address: settings?.contact?.address || '',
    city: settings?.contact?.city || '',
    state: settings?.contact?.state || '',
    country: settings?.contact?.country || '',
    zipCode: settings?.contact?.zipCode || '',
    businessHours: settings?.contact?.businessHours || {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
    timezone: settings?.contact?.timezone || 'UTC',
    emergencyContact: settings?.contact?.emergencyContact || '',
  });

  const updateContactMutation = useUpdateContactInfo();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateContactMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error updating contact settings:', error);
    }
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Support Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Support Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email *</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  placeholder="support@yourstore.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={formData.supportPhone}
                  onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Sales Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salesEmail">Sales Email</Label>
                <Input
                  id="salesEmail"
                  type="email"
                  value={formData.salesEmail}
                  onChange={(e) => handleInputChange('salesEmail', e.target.value)}
                  placeholder="sales@yourstore.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesPhone">Sales Phone</Label>
                <Input
                  id="salesPhone"
                  value={formData.salesPhone}
                  onChange={(e) => handleInputChange('salesPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Billing Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Billing Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Billing Email</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                  placeholder="billing@yourstore.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPhone">Billing Phone</Label>
                <Input
                  id="billingPhone"
                  value={formData.billingPhone}
                  onChange={(e) => handleInputChange('billingPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Emergency contact information"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Physical Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter physical address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="Enter zip code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Enter country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                placeholder="UTC"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-24">
                  <Label className="font-medium">{day.label}</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!formData.businessHours[day.key]?.closed}
                    onChange={(e) => handleBusinessHoursChange(day.key, 'closed', !e.target.checked)}
                    className="rounded"
                  />
                  <Label className="text-sm">Open</Label>
                </div>

                {!formData.businessHours[day.key]?.closed && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formData.businessHours[day.key]?.open || ''}
                      onChange={(e) => handleBusinessHoursChange(day.key, 'open', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={formData.businessHours[day.key]?.close || ''}
                      onChange={(e) => handleBusinessHoursChange(day.key, 'close', e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}

                {formData.businessHours[day.key]?.closed && (
                  <span className="text-gray-500 text-sm">Closed</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updateContactMutation.isPending}
          className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {updateContactMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Contact Settings
        </Button>
      </div>
    </div>
  );
}
