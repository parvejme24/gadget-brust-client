"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUpdateCurrencySettings } from '@/lib/hooks/useStoreSettings';
import { Loader2, DollarSign, Globe, Clock, MapPin } from 'lucide-react';

export default function CurrencySettings({ settings, isLoading }) {
  const [formData, setFormData] = useState({
    defaultCurrency: settings?.currency?.defaultCurrency || 'USD',
    currencySymbol: settings?.currency?.currencySymbol || '$',
    currencyPosition: settings?.currency?.currencyPosition || 'before',
    decimalPlaces: settings?.currency?.decimalPlaces || 2,
    thousandSeparator: settings?.currency?.thousandSeparator || ',',
    decimalSeparator: settings?.currency?.decimalSeparator || '.',
    defaultLanguage: settings?.currency?.defaultLanguage || 'en',
    defaultTimezone: settings?.currency?.defaultTimezone || 'UTC',
    defaultCountry: settings?.currency?.defaultCountry || 'US',
    dateFormat: settings?.currency?.dateFormat || 'MM/DD/YYYY',
    timeFormat: settings?.currency?.timeFormat || '12',
    enableMultiCurrency: settings?.currency?.enableMultiCurrency || false,
    enableCurrencySwitcher: settings?.currency?.enableCurrencySwitcher || false,
    supportedCurrencies: settings?.currency?.supportedCurrencies || ['USD', 'EUR', 'GBP'],
    supportedLanguages: settings?.currency?.supportedLanguages || ['en', 'es', 'fr'],
    supportedCountries: settings?.currency?.supportedCountries || ['US', 'CA', 'GB'],
    autoDetectCurrency: settings?.currency?.autoDetectCurrency || true,
    autoDetectLanguage: settings?.currency?.autoDetectLanguage || true,
    autoDetectCountry: settings?.currency?.autoDetectCountry || true,
  });

  const updateCurrencyMutation = useUpdateCurrencySettings();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateCurrencyMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error updating currency settings:', error);
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' },
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
      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <select
                id="defaultCurrency"
                value={formData.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currencySymbol">Currency Symbol</Label>
              <Input
                id="currencySymbol"
                value={formData.currencySymbol}
                onChange={(e) => handleInputChange('currencySymbol', e.target.value)}
                placeholder="$"
                maxLength={5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currencyPosition">Currency Position</Label>
            <select
              id="currencyPosition"
              value={formData.currencyPosition}
              onChange={(e) => handleInputChange('currencyPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
            >
              <option value="before">Before amount ($100)</option>
              <option value="after">After amount (100$)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decimalPlaces">Decimal Places</Label>
              <Input
                id="decimalPlaces"
                type="number"
                min="0"
                max="4"
                value={formData.decimalPlaces}
                onChange={(e) => handleInputChange('decimalPlaces', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thousandSeparator">Thousand Separator</Label>
              <Input
                id="thousandSeparator"
                value={formData.thousandSeparator}
                onChange={(e) => handleInputChange('thousandSeparator', e.target.value)}
                placeholder=","
                maxLength={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimalSeparator">Decimal Separator</Label>
              <Input
                id="decimalSeparator"
                value={formData.decimalSeparator}
                onChange={(e) => handleInputChange('decimalSeparator', e.target.value)}
                placeholder="."
                maxLength={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Currency */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Currency Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableMultiCurrency">Enable Multi-Currency</Label>
              <p className="text-sm text-gray-600">
                Allow customers to view prices in different currencies
              </p>
            </div>
            <Switch
              id="enableMultiCurrency"
              checked={formData.enableMultiCurrency}
              onCheckedChange={(checked) => handleInputChange('enableMultiCurrency', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableCurrencySwitcher">Enable Currency Switcher</Label>
              <p className="text-sm text-gray-600">
                Show currency switcher in the header
              </p>
            </div>
            <Switch
              id="enableCurrencySwitcher"
              checked={formData.enableCurrencySwitcher}
              onCheckedChange={(checked) => handleInputChange('enableCurrencySwitcher', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoDetectCurrency">Auto-Detect Currency</Label>
              <p className="text-sm text-gray-600">
                Automatically detect customer's currency based on location
              </p>
            </div>
            <Switch
              id="autoDetectCurrency"
              checked={formData.autoDetectCurrency}
              onCheckedChange={(checked) => handleInputChange('autoDetectCurrency', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Localization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <select
                id="defaultLanguage"
                value={formData.defaultLanguage}
                onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCountry">Default Country</Label>
              <select
                id="defaultCountry"
                value={formData.defaultCountry}
                onChange={(e) => handleInputChange('defaultCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultTimezone">Default Timezone</Label>
            <Input
              id="defaultTimezone"
              value={formData.defaultTimezone}
              onChange={(e) => handleInputChange('defaultTimezone', e.target.value)}
              placeholder="UTC"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoDetectLanguage">Auto-Detect Language</Label>
              <p className="text-sm text-gray-600">
                Automatically detect customer's language preference
              </p>
            </div>
            <Switch
              id="autoDetectLanguage"
              checked={formData.autoDetectLanguage}
              onCheckedChange={(checked) => handleInputChange('autoDetectLanguage', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoDetectCountry">Auto-Detect Country</Label>
              <p className="text-sm text-gray-600">
                Automatically detect customer's country
              </p>
            </div>
            <Switch
              id="autoDetectCountry"
              checked={formData.autoDetectCountry}
              onCheckedChange={(checked) => handleInputChange('autoDetectCountry', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Date & Time Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Date & Time Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <select
                id="dateFormat"
                value={formData.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                <option value="DD MMM YYYY">DD MMM YYYY</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <select
                id="timeFormat"
                value={formData.timeFormat}
                onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
              >
                <option value="12">12 Hour (AM/PM)</option>
                <option value="24">24 Hour</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updateCurrencyMutation.isPending}
          className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {updateCurrencyMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Currency Settings
        </Button>
      </div>
    </div>
  );
}
