import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Generate unique ID for each notification
  const generateId = useCallback(() => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }, []);

  // Add a new notification
  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = generateId();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      timestamp: Date.now(),
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, [generateId]);

  // Remove a specific notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper functions for different notification types
  const showSuccess = useCallback((message, duration = 3000) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message, duration = 4000) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration = 3000) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration = 3500) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  // Parse API response and show appropriate notification
  const showApiResponse = useCallback((response, successMessage = null) => {
    try {
      // Handle different response formats
      const data = response.data || response;
      
      if (data.status === 'success') {
        const message = successMessage || data.message || 'Operation completed successfully';
        return showSuccess(message);
      } else if (data.status === 'failed' || data.status === 'error') {
        // Handle errors array format
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const errorMessage = data.errors[0].msg || data.errors[0].message || 'An error occurred';
          return showError(errorMessage);
        } else if (data.message) {
          return showError(data.message);
        } else {
          return showError('An error occurred');
        }
      }
      
      // Fallback for unknown response format
      if (successMessage) {
        return showSuccess(successMessage);
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing API response for notification:', error);
      return showError('An unexpected error occurred');
    }
  }, [showSuccess, showError]);

  // Handle API errors (for catch blocks)
  const showApiError = useCallback((error, defaultMessage = 'An error occurred') => {
    try {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || 
                          error.response?.data?.message || 
                          error.message || 
                          defaultMessage;
      return showError(errorMessage);
    } catch (e) {
      console.error('Error parsing API error for notification:', e);
      return showError(defaultMessage);
    }
  }, [showError]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showApiResponse,
    showApiError
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;