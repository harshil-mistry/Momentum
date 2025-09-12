import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-green-500 dark:bg-green-600',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'error':
        return {
          background: 'bg-red-500 dark:bg-red-600',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'warning':
        return {
          background: 'bg-yellow-500 dark:bg-yellow-600',
          text: 'text-white',
          icon: 'text-white'
        };
      case 'info':
      default:
        return {
          background: 'bg-blue-500 dark:bg-blue-600',
          text: 'text-white',
          icon: 'text-white'
        };
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => {
          const styles = getStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ 
                opacity: 0, 
                x: -100, 
                scale: 0.8 
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                x: -100, 
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`
                ${styles.background} ${styles.text}
                rounded-lg shadow-lg border border-opacity-20 border-white
                max-w-sm w-full pointer-events-auto
                transform transition-all duration-200 hover:scale-105
              `}
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${styles.icon} mt-0.5`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium break-words">
                      {notification.message}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className={`
                      flex-shrink-0 ${styles.icon} hover:opacity-70 
                      transition-opacity duration-200 ml-2 mt-0.5
                    `}
                    aria-label="Close notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Progress bar for auto-dismiss */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ 
                    duration: notification.duration / 1000, 
                    ease: "linear" 
                  }}
                  className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-white bg-opacity-50 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;