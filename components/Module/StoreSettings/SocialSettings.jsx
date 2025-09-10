"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUpdateSocialLinks } from '@/lib/hooks/useStoreSettings';
import { Loader2, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe, Share2, Mail } from 'lucide-react';

export default function SocialSettings({ settings, isLoading }) {
  const [formData, setFormData] = useState({
    facebook: settings?.social?.facebook || '',
    twitter: settings?.social?.twitter || '',
    instagram: settings?.social?.instagram || '',
    linkedin: settings?.social?.linkedin || '',
    youtube: settings?.social?.youtube || '',
    tiktok: settings?.social?.tiktok || '',
    pinterest: settings?.social?.pinterest || '',
    snapchat: settings?.social?.snapchat || '',
    whatsapp: settings?.social?.whatsapp || '',
    telegram: settings?.social?.telegram || '',
    discord: settings?.social?.discord || '',
    reddit: settings?.social?.reddit || '',
    github: settings?.social?.github || '',
    website: settings?.social?.website || '',
    blog: settings?.social?.blog || '',
    newsletter: settings?.social?.newsletter || '',
    enableSocialLogin: settings?.social?.enableSocialLogin || false,
    enableSocialSharing: settings?.social?.enableSocialSharing || true,
    showSocialLinks: settings?.social?.showSocialLinks || true,
    socialLoginProviders: settings?.social?.socialLoginProviders || {
      facebook: false,
      google: false,
      twitter: false,
      github: false,
    },
  });

  const updateSocialMutation = useUpdateSocialLinks();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLoginProviderChange = (provider, enabled) => {
    setFormData(prev => ({
      ...prev,
      socialLoginProviders: {
        ...prev.socialLoginProviders,
        [provider]: enabled
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateSocialMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error updating social settings:', error);
    }
  };

  const socialPlatforms = [
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      placeholder: 'https://facebook.com/yourstore',
      color: 'text-blue-600'
    },
    {
      key: 'twitter',
      label: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      placeholder: 'https://twitter.com/yourstore',
      color: 'text-blue-400'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <Instagram className="h-4 w-4" />,
      placeholder: 'https://instagram.com/yourstore',
      color: 'text-pink-500'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      placeholder: 'https://linkedin.com/company/yourstore',
      color: 'text-blue-700'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: <Youtube className="h-4 w-4" />,
      placeholder: 'https://youtube.com/c/yourstore',
      color: 'text-red-600'
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: 'https://tiktok.com/@yourstore',
      color: 'text-black'
    },
    {
      key: 'pinterest',
      label: 'Pinterest',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: 'https://pinterest.com/yourstore',
      color: 'text-red-500'
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: '+1234567890',
      color: 'text-green-600'
    },
    {
      key: 'telegram',
      label: 'Telegram',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: 'https://t.me/yourstore',
      color: 'text-blue-500'
    },
    {
      key: 'discord',
      label: 'Discord',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: 'https://discord.gg/yourstore',
      color: 'text-indigo-600'
    },
    {
      key: 'reddit',
      label: 'Reddit',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: 'https://reddit.com/r/yourstore',
      color: 'text-orange-600'
    },
    {
      key: 'github',
      label: 'GitHub',
      icon: <Share2 className="h-4 w-4" />,
      placeholder: 'https://github.com/yourstore',
      color: 'text-gray-800'
    },
  ];

  const additionalLinks = [
    {
      key: 'website',
      label: 'Website',
      icon: <Globe className="h-4 w-4" />,
      placeholder: 'https://yourstore.com',
      color: 'text-gray-600'
    },
    {
      key: 'blog',
      label: 'Blog',
      icon: <Globe className="h-4 w-4" />,
      placeholder: 'https://blog.yourstore.com',
      color: 'text-gray-600'
    },
    {
      key: 'newsletter',
      label: 'Newsletter Signup',
      icon: <Mail className="h-4 w-4" />,
      placeholder: 'https://yourstore.com/newsletter',
      color: 'text-gray-600'
    },
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
      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialPlatforms.map((platform) => (
              <div key={platform.key} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className={platform.color}>{platform.icon}</span>
                  {platform.label}
                </Label>
                <Input
                  value={formData[platform.key]}
                  onChange={(e) => handleInputChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Additional Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalLinks.map((link) => (
              <div key={link.key} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className={link.color}>{link.icon}</span>
                  {link.label}
                </Label>
                <Input
                  value={formData[link.key]}
                  onChange={(e) => handleInputChange(link.key, e.target.value)}
                  placeholder={link.placeholder}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Features */}
      <Card>
        <CardHeader>
          <CardTitle>Social Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableSocialLogin">Enable Social Login</Label>
              <p className="text-sm text-gray-600">
                Allow customers to login using social media accounts
              </p>
            </div>
            <Switch
              id="enableSocialLogin"
              checked={formData.enableSocialLogin}
              onCheckedChange={(checked) => handleInputChange('enableSocialLogin', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableSocialSharing">Enable Social Sharing</Label>
              <p className="text-sm text-gray-600">
                Allow customers to share products on social media
              </p>
            </div>
            <Switch
              id="enableSocialSharing"
              checked={formData.enableSocialSharing}
              onCheckedChange={(checked) => handleInputChange('enableSocialSharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="showSocialLinks">Show Social Links</Label>
              <p className="text-sm text-gray-600">
                Display social media links on your website
              </p>
            </div>
            <Switch
              id="showSocialLinks"
              checked={formData.showSocialLinks}
              onCheckedChange={(checked) => handleInputChange('showSocialLinks', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Login Providers */}
      {formData.enableSocialLogin && (
        <Card>
          <CardHeader>
            <CardTitle>Social Login Providers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData.socialLoginProviders).map((provider) => (
                <div key={provider} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="capitalize font-medium">{provider}</span>
                  </div>
                  <Switch
                    checked={formData.socialLoginProviders[provider]}
                    onCheckedChange={(checked) => handleSocialLoginProviderChange(provider, checked)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updateSocialMutation.isPending}
          className="bg-[#38AD81] hover:bg-[#2d8f6a] text-white"
        >
          {updateSocialMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Social Settings
        </Button>
      </div>
    </div>
  );
}
