import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/lib/services/customerService";

// Hook to get all customers
export const useAllCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getAllCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get customer by ID
export const useCustomerById = (customerId) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customerService.getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, customerData }) => 
      customerService.updateCustomer(customerId, customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Hook to delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerId) => customerService.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Hook to update customer role
export const useUpdateCustomerRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, role }) => 
      customerService.updateCustomerRole(customerId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
