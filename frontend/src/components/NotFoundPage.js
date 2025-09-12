import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Compass, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-md w-full space-y-8 text-center mt-[8rem] mb-[2rem]">
        {/* Animated 404 Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <motion.div
            variants={floatingVariants}
            animate="float"
            className="relative"
          >
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <Compass className="h-16 w-16 text-white animate-pulse" />
            </div>
            {/* Floating circles */}
            <motion.div
              className="absolute -top-4 -right-4 w-6 h-6 bg-green-300 rounded-full opacity-60"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-6 w-4 h-4 bg-green-500 rounded-full opacity-40"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [-5, 5, -5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Error Content */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <motion.h1
              className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              404
            </motion.h1>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              The page you're looking for seems to have wandered off. 
              Let's get you back on track with your momentum!
            </p>
          </div>

          {/* Suggestions Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-center mb-4">
              <Search className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                What can you do?
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <motion.li
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AlertCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                Check the URL for typos
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RefreshCw className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                Refresh the page
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Home className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                Return to your dashboard
              </motion.li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={handleGoBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </motion.button>
            
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium w-full sm:w-auto"
              >
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;