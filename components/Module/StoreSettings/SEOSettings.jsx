"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useUpdateSEOSettings } from '@/lib/hooks/useStoreSettings';
import { Loader2, Search, Globe, Eye, BarChart3 } from 'lucide-react';

export default function SEOSettings({ settings, isLoading }) {
  const [formData, setFormData] = useState({
    metaTitle: settings?.seo?.metaTitle || '',
    metaDescription: settings?.seo?.metaDescription || '',
    metaKeywords: settings?.seo?.metaKeywords || '',
    ogTitle: settings?.seo?.ogTitle || '',
    ogDescription: settings?.seo?.ogDescription || '',
    ogImage: settings?.seo?.ogImage || '',
    twitterCard: settings?.seo?.twitterCard || 'summary_large_image',
    twitterSite: settings?.seo?.twitterSite || '',
    twitterCreator: settings?.seo?.twitterCreator || '',
    canonicalUrl: settings?.seo?.canonicalUrl || '',
    robotsTxt: settings?.seo?.robotsTxt || '',
    sitemapUrl: settings?.seo?.sitemapUrl || '',
    googleAnalyticsId: settings?.seo?.googleAnalyticsId || '',
    googleTagManagerId: settings?.seo?.googleTagManagerId || '',
    facebookPixelId: settings?.seo?.facebookPixelId || '',
    enableSitemap: settings?.seo?.enableSitemap || true,
    enableRobotsTxt: settings?.seo?.enableRobotsTxt || true,
    enableSchemaMarkup: settings?.seo?.enableSchemaMarkup || true,
    enableOpenGraph: settings?.seo?.enableOpenGraph || true,
    enableTwitterCards: settings?.seo?.enableTwitterCards || true,
    enableGoogleAnalytics: settings?.seo?.enableGoogleAnalytics || false,
    enableGoogleTagManager: settings?.seo?.enableGoogleTagManager || false,
    enableFacebookPixel: settings?.seo?.enableFacebookPixel || false,
  });

  const updateSEOMutation = useUpdateSEOSettings();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateSEOMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error updating SEO settings:', error);
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
      {/* Basic SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Basic SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title *</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              placeholder="Enter your site's meta title"
              maxLength={60}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.metaTitle.length}/60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description *</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Enter your site's meta description"
              rows={3}
              maxLength={160}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.metaDescription.length}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              value={formData.metaKeywords}
              onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-gray-500">
              Separate keywords with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              value={formData.canonicalUrl}
              onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
              placeholder="https://yourstore.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Open Graph Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <Label htmlFor="enableOpenGraph">Enable Open Graph</Label>
              <p className="text-sm text-gray-600">
                Enable Open Graph meta tags for social media sharing
              </p>
            </div>
            <Switch
              id="enableOpenGraph"
              checked={formData.enableOpenGraph}
              onCheckedChange={(checked) => handleInputChange('enableOpenGraph', checked)}
            />
          </div>

          {formData.enableOpenGraph && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ogTitle">Open Graph Title</Label>
                <Input
                  id="ogTitle"
                  value={formData.ogTitle}
                  onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                  placeholder="Enter Open Graph title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">Open Graph Description</Label>
                <Textarea
                  id="ogDescription"
                  value={formData.ogDescription}
                  onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                  placeholder="Enter Open Graph description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image URL</Label>
                <Input
                  id="ogImage"
                  value={formData.ogImage}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                  placeholder="https://yourstore.com/og-image.jpg"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Twitter Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Twitter Card Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <Label htmlFor="enableTwitterCards">Enable Twitter Cards</Label>
              <p className="text-sm text-gray-600">
                Enable Twitter Card meta tags
              </p>
            </div>
            <Switch
              id="enableTwitterCards"
              checked={formData.enableTwitterCards}
              onCheckedChange={(checked) => handleInputChange('enableTwitterCards', checked)}
            />
          </div>

          {formData.enableTwitterCards && (
            <>
              <div className="space-y-2">
                <Label htmlFor="twitterCard">Twitter Card Type</Label>
                <select
                  id="twitterCard"
                  value={formData.twitterCard}
                  onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38AD81]"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterSite">Twitter Site</Label>
                <Input
                  id="twitterSite"
                  value={formData.twitterSite}
                  onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                  placeholder="@yourstore"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterCreator">Twitter Creator</Label>
                <Input
                  id="twitterCreator"
                  value={formData.twitterCreator}
                  onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                  placeholder="@yourstore"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Analytics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableGoogleAnalytics">Enable Google Analytics</Label>
                <p className="text-sm text-gray-600">
                  Track website traffic and user behavior
                </p>
              </div>
              <Switch
                id="enableGoogleAnalytics"
                checked={formData.enableGoogleAnalytics}
                onCheckedChange={(checked) => handleInputChange('enableGoogleAnalytics', checked)}
              />
            </div>

            {formData.enableGoogleAnalytics && (
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={formData.googleAnalyticsId}
                  onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            )}
          </div>

          {/* Google Tag Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableGoogleTagManager">Enable Google Tag Manager</Label>
                <p className="text-sm text-gray-600">
                  Manage all your tracking codes in one place
                </p>
              </div>
              <Switch
                id="enableGoogleTagManager"
                checked={formData.enableGoogleTagManager}
                onCheckedChange={(checked) => handleInputChange('enableGoogleTagManager', checked)}
              />
            </div>

            {formData.enableGoogleTagManager && (
              <div className="space-y-2">
                <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManagerId"
                  value={formData.googleTagManagerId}
                  onChange={(e) => handleInputChange('googleTagManagerId', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            )}
          </div>

          {/* Facebook Pixel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableFacebookPixel">Enable Facebook Pixel</Label>
                <p className="text-sm text-gray-600">
                  Track conversions and optimize Facebook ads
                </p>
              </div>
              <Switch
                id="enableFacebookPixel"
                checked={formData.enableFacebookPixel}
                onCheckedChange={(checked) => handleInputChange('enableFacebookPixel', checked)}
              />
            </div>

            {formData.enableFacebookPixel && (
              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  value={formData.facebookPixelId}
                  onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Technical SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Technical SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableSitemap">Enable Sitemap</Label>
              <p className="text-sm text-gray-600">
                Generate and serve XML sitemap
              </p>
            </div>
            <Switch
              id="enableSitemap"
              checked={formData.enableSitemap}
              onCheckedChange={(checked) => handleInputChange('enableSitemap', checked)}
            />
          </div>

          {formData.enableSitemap && (
            <div className="space-y-2">
              <Label htmlFor="sitemapUrl">Sitemap URL</Label>
              <Input
                id="sitemapUrl"
                value={formData.sitemapUrl}
                onChange={(e) => handleInputChange('sitemapUrl', e.target.value)}
                placeholder="https://yourstore.com/sitemap.xml"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableRobotsTxt">Enable Robots.txt</Label>
              <p className="text-sm text-gray-600">
                Serve robots.txt file for search engines
              </p>
            </div>
            <Switch
              id="enableRobotsTxt"
              checked={formData.enableRobotsTxt}
              onCheckedChange={(checked) => handleInputChange('enableRobotsTxt', checked)}
            />
          </div>

          {formData.enableRobotsTxt && (
            <div className="space-y-2">
              <Label htmlFor="robotsTxt">Robots.txt Content</Label>
              <Textarea
                id="robotsTxt"
                value={formData.robotsTxt}
                onChange={(e) => handleInputChange('robotsTxt', e.target.value)}
                placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/"
                rows={4}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableSchemaMarkup">Enable Schema Markup</Label>
              <p className="text-sm text-gray-600">
                Add structured data markup for better search results
              </p>
            </div>
            <Switch
              id="enableSchemaMarkup"
              checked={formData.enableSchemaMarkup}
              onCheckedChange={(checked) => handleInputChange('enableSchemaMarkup', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updateSEOMutation.isPending}
          className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {updateSEOMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save SEO Settings
        </Button>
      </div>
    </div>
  );
}
