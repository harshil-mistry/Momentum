import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Zap, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-green-100 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                Momentum
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-100 dark:bg-gray-800 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <motion.div
                      className="px-4 py-2 text-green-600 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      Dashboard
                    </motion.div>
                  </Link>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <motion.div
                      className="px-4 py-2 text-green-600 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      Sign In
                    </motion.div>
                  </Link>
                  <Link to="/signup">
                    <motion.div
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-green-100 dark:bg-gray-800 text-green-600 dark:text-green-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-800 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <div className="py-4 space-y-4">
            {/* {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-300"
                whileHover={{ x: 10 }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </motion.a>
            ))} */}
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                      className="block w-full text-left text-green-600 dark:text-green-400 font-medium"
                      whileHover={{ x: 10 }}
                    >
                      Dashboard
                    </motion.div>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Welcome, {user?.name}
                    </span>
                    <motion.button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-red-600 dark:text-red-400 text-sm font-medium"
                      whileHover={{ x: 5 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                      className="block w-full text-center text-green-600 dark:text-green-400 font-medium pb-6"
                      whileHover={{ x: 10 }}
                    >
                      Sign In
                    </motion.div>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <motion.div
                      className="block w-full px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-lg text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Started
                    </motion.div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
