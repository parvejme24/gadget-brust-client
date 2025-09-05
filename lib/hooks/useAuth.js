import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

// auth queries
export const useAuthProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['auth', 'users'],
    queryFn: authService.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ['auth', 'user', userId],
    queryFn: () => authService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserByEmail = (email) => {
  return useQuery({
    queryKey: ['auth', 'user', 'email', email],
    queryFn: () => authService.getUserByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// auth mutations
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // store tokens
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      // invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // store tokens
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      // invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // clear all queries
      queryClient.clear();
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      // invalidate profile query
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.deleteProfile,
    onSuccess: () => {
      // clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // clear all queries
      queryClient.clear();
    },
  });
};

// admin mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.createUser,
    onSuccess: () => {
      // invalidate users query
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }) => authService.updateUser(userId, userData),
    onSuccess: (data, variables) => {
      // invalidate users query
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
      // invalidate specific user query
      queryClient.invalidateQueries({ queryKey: ['auth', 'user', variables.userId] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }) => authService.updateUserRole(userId, role),
    onSuccess: (data, variables) => {
      // invalidate users query
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
      // invalidate specific user query
      queryClient.invalidateQueries({ queryKey: ['auth', 'user', variables.userId] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.deleteUser,
    onSuccess: () => {
      // invalidate users query
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};
