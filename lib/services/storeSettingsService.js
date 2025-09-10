import api from '../api';

export const storeSettingsService = {
  // Get all store settings
  getStoreSettings: async () => {
    try {
      const response = await api.get('/store-settings');
      return response.data;
    } catch (error) {
      // Return mock data if API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          data: {
            general: {
              storeName: 'Gadget Brust',
              storeDescription: 'Your one-stop shop for the latest gadgets and electronics',
              storeTagline: 'Innovation at your fingertips',
              storeEmail: 'info@gadgetbrust.com',
              storePhone: '+1 (555) 123-4567',
              storeAddress: '123 Tech Street, Innovation District',
              storeCity: 'San Francisco',
              storeState: 'CA',
              storeCountry: 'United States',
              storeZipCode: '94105',
              storeWebsite: 'https://gadgetbrust.com',
              logoUrl: null,
              faviconUrl: null,
              isMaintenanceMode: false,
              allowRegistration: true,
              allowGuestCheckout: true,
            },
            contact: {
              supportEmail: 'support@gadgetbrust.com',
              supportPhone: '+1 (555) 123-4567',
              salesEmail: 'sales@gadgetbrust.com',
              salesPhone: '+1 (555) 123-4568',
              billingEmail: 'billing@gadgetbrust.com',
              billingPhone: '+1 (555) 123-4569',
              address: '123 Tech Street, Innovation District',
              city: 'San Francisco',
              state: 'CA',
              country: 'United States',
              zipCode: '94105',
              timezone: 'America/Los_Angeles',
              emergencyContact: '+1 (555) 911-0000',
              businessHours: {
                monday: { open: '09:00', close: '18:00', closed: false },
                tuesday: { open: '09:00', close: '18:00', closed: false },
                wednesday: { open: '09:00', close: '18:00', closed: false },
                thursday: { open: '09:00', close: '18:00', closed: false },
                friday: { open: '09:00', close: '18:00', closed: false },
                saturday: { open: '10:00', close: '16:00', closed: false },
                sunday: { open: '', close: '', closed: true },
              },
            },
            social: {
              facebook: '',
              twitter: '',
              instagram: '',
              linkedin: '',
              youtube: '',
              tiktok: '',
              pinterest: '',
              whatsapp: '',
              telegram: '',
              discord: '',
              reddit: '',
              github: '',
              website: 'https://gadgetbrust.com',
              blog: '',
              newsletter: '',
              enableSocialLogin: false,
              enableSocialSharing: true,
              showSocialLinks: true,
              socialLoginProviders: {
                facebook: false,
                google: false,
                twitter: false,
                github: false,
              },
            },
            seo: {
              metaTitle: 'Gadget Brust - Latest Gadgets & Electronics',
              metaDescription: 'Discover the latest gadgets and electronics at Gadget Brust. Quality products, competitive prices, and excellent customer service.',
              metaKeywords: 'gadgets, electronics, technology, smartphones, laptops',
              ogTitle: 'Gadget Brust - Latest Gadgets & Electronics',
              ogDescription: 'Discover the latest gadgets and electronics at Gadget Brust.',
              ogImage: '',
              twitterCard: 'summary_large_image',
              twitterSite: '@gadgetbrust',
              twitterCreator: '@gadgetbrust',
              canonicalUrl: 'https://gadgetbrust.com',
              robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/',
              sitemapUrl: 'https://gadgetbrust.com/sitemap.xml',
              googleAnalyticsId: '',
              googleTagManagerId: '',
              facebookPixelId: '',
              enableSitemap: true,
              enableRobotsTxt: true,
              enableSchemaMarkup: true,
              enableOpenGraph: true,
              enableTwitterCards: true,
              enableGoogleAnalytics: false,
              enableGoogleTagManager: false,
              enableFacebookPixel: false,
            },
            currency: {
              defaultCurrency: 'USD',
              currencySymbol: '$',
              currencyPosition: 'before',
              decimalPlaces: 2,
              thousandSeparator: ',',
              decimalSeparator: '.',
              defaultLanguage: 'en',
              defaultTimezone: 'America/Los_Angeles',
              defaultCountry: 'US',
              dateFormat: 'MM/DD/YYYY',
              timeFormat: '12',
              enableMultiCurrency: false,
              enableCurrencySwitcher: false,
              supportedCurrencies: ['USD', 'EUR', 'GBP'],
              supportedLanguages: ['en', 'es', 'fr'],
              supportedCountries: ['US', 'CA', 'GB'],
              autoDetectCurrency: true,
              autoDetectLanguage: true,
              autoDetectCountry: true,
            },
          },
        };
      }
      throw error;
    }
  },

  // Update general settings
  updateGeneralSettings: async (settings) => {
    try {
      const response = await api.put('/store-settings/general', settings);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'General settings updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update contact information
  updateContactInfo: async (contactInfo) => {
    try {
      const response = await api.put('/store-settings/contact', contactInfo);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Contact information updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update social media links
  updateSocialLinks: async (socialLinks) => {
    try {
      const response = await api.put('/store-settings/social', socialLinks);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Social media links updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update SEO settings
  updateSEOSettings: async (seoSettings) => {
    try {
      const response = await api.put('/store-settings/seo', seoSettings);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'SEO settings updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update store logo
  updateStoreLogo: async (logoFile) => {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      const response = await api.put('/store-settings/logo', formData);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Store logo updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update store favicon
  updateStoreFavicon: async (faviconFile) => {
    try {
      const formData = new FormData();
      formData.append('favicon', faviconFile);
      
      const response = await api.put('/store-settings/favicon', formData);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Store favicon updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update business hours
  updateBusinessHours: async (businessHours) => {
    try {
      const response = await api.put('/store-settings/business-hours', businessHours);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Business hours updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update currency and localization
  updateCurrencySettings: async (currencySettings) => {
    try {
      const response = await api.put('/store-settings/currency', currencySettings);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Currency settings updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (notificationSettings) => {
    try {
      const response = await api.put('/store-settings/notifications', notificationSettings);
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Notification settings updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Update maintenance mode
  updateMaintenanceMode: async (isMaintenanceMode) => {
    try {
      const response = await api.put('/store-settings/maintenance', { isMaintenanceMode });
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Maintenance mode updated successfully (mock)' };
      }
      throw error;
    }
  },

  // Reset all settings to default
  resetToDefault: async () => {
    try {
      const response = await api.post('/store-settings/reset');
      return response.data;
    } catch (error) {
      // Mock success response when API is not available
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Settings reset to default successfully (mock)' };
      }
      throw error;
    }
  }
};
