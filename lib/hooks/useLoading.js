import { useLoading } from '@/lib/providers/LoadingProvider';

// Custom hook for loading states
export const useLoadingState = () => {
  const { isLoading, loadingMessage, showLoading, hideLoading } = useLoading();

  // Wrapper function for async operations with loading
  const withLoading = async (asyncFunction, message = 'Loading...') => {
    try {
      showLoading(message);
      const result = await asyncFunction();
      return result;
    } finally {
      hideLoading();
    }
  };

  // Wrapper for multiple async operations
  const withMultipleLoading = async (operations, message = 'Processing...') => {
    try {
      showLoading(message);
      const results = await Promise.all(operations);
      return results;
    } finally {
      hideLoading();
    }
  };

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    withLoading,
    withMultipleLoading,
  };
};

export default useLoadingState;


