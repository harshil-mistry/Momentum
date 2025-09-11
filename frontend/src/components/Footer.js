import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const Footer = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="mt-16"
    >
      <div className="rounded-xl shadow-lg p-8 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Momentum
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Streamlining project management with modern technology
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>React</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Node.js</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>MongoDB</span>
            </span>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-4"></div>
          
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 Momentum Project Management. All rights reserved.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
