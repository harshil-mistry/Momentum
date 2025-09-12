import { useNotification } from '../contexts/NotificationContext';

// Custom hook for API calls with automatic notifications
export const useApiWithNotifications = () => {
  const { showApiResponse, showApiError } = useNotification();

  const apiCall = async (apiFunction, successMessage = null) => {
    try {
      const response = await apiFunction();
      showApiResponse(response, successMessage);
      return { success: true, data: response };
    } catch (error) {
      showApiError(error);
      return { success: false, error };
    }
  };

  return { apiCall, showApiResponse, showApiError };
};

export default useApiWithNotifications;