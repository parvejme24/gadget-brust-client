import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services/dashboardService";

// Hook to get dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Hook to get revenue analytics
export const useRevenueAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'revenue', params],
    queryFn: () => dashboardService.getRevenueAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get product analytics
export const useProductAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'products', params],
    queryFn: () => dashboardService.getProductAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get customer analytics
export const useCustomerAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'customers', params],
    queryFn: () => dashboardService.getCustomerAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get sales analytics
export const useSalesAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'sales', params],
    queryFn: () => dashboardService.getSalesAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get recent activities
export const useRecentActivities = (params = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'activities', params],
    queryFn: () => dashboardService.getRecentActivities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for activities)
  });
};
