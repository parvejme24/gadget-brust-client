import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeSettingsService } from '../services/storeSettingsService';
import { toast } from 'sonner';

// Hook to get all store settings
export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['storeSettings'],
    queryFn: storeSettingsService.getStoreSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 or network error (API not available)
      if (error?.response?.status === 404 || error?.code === 'ERR_NETWORK') {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook to update general settings
export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateGeneralSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      const isMock = data?.message?.includes('(mock)');
      toast.success('General settings updated successfully!', {
        description: isMock ? 'Settings saved (demo mode)' : 'Your store general settings have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update general settings', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update contact information
export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateContactInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      const isMock = data?.message?.includes('(mock)');
      toast.success('Contact information updated successfully!', {
        description: isMock ? 'Contact details saved (demo mode)' : 'Your store contact details have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update contact information', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update social media links
export const useUpdateSocialLinks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateSocialLinks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Social media links updated successfully!', {
        description: 'Your social media links have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update social media links', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update SEO settings
export const useUpdateSEOSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateSEOSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('SEO settings updated successfully!', {
        description: 'Your SEO settings have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update SEO settings', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update store logo
export const useUpdateStoreLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateStoreLogo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Store logo updated successfully!', {
        description: 'Your store logo has been updated.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update store logo', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update store favicon
export const useUpdateStoreFavicon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateStoreFavicon,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Store favicon updated successfully!', {
        description: 'Your store favicon has been updated.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update store favicon', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update business hours
export const useUpdateBusinessHours = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateBusinessHours,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Business hours updated successfully!', {
        description: 'Your business hours have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update business hours', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update currency settings
export const useUpdateCurrencySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateCurrencySettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Currency settings updated successfully!', {
        description: 'Your currency and localization settings have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update currency settings', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update notification settings
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Notification settings updated successfully!', {
        description: 'Your notification preferences have been saved.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update notification settings', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to update maintenance mode
export const useUpdateMaintenanceMode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.updateMaintenanceMode,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Maintenance mode updated successfully!', {
        description: data.isMaintenanceMode ? 'Store is now in maintenance mode.' : 'Store is now live.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to update maintenance mode', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};

// Hook to reset settings to default
export const useResetStoreSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: storeSettingsService.resetToDefault,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Settings reset successfully!', {
        description: 'All store settings have been reset to default values.',
        duration: 4000,
      });
    },
    onError: (error) => {
      toast.error('Failed to reset settings', {
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        duration: 5000,
      });
    },
  });
};
