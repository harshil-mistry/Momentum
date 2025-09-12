import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signup, isAuthenticated, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!passwordValidation.isValid) newErrors.password = 'Password does not meet requirements';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) newErrors.terms = 'You must agree to the terms and conditions';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(formData.name, formData.email, formData.password);
      
      if (result.success) {
        showSuccess('Account created successfully! Welcome to Momentum.');
        navigate('/dashboard');
      } else {
        // Handle backend validation errors
        const backendErrors = {};
        let errorMessage = 'Registration failed';
        
        if (result.errors) {
          result.errors.forEach(error => {
            if (error.param) {
              backendErrors[error.param] = error.msg;
            } else {
              backendErrors.general = error.msg;
              errorMessage = error.msg;
            }
          });
        }
        
        setErrors(backendErrors);
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMsg });
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-green-900/20 flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-1/4 -right-10 w-72 h-72 bg-gradient-to-r from-green-200/20 to-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-1/4 -left-10 w-96 h-96 bg-gradient-to-r from-green-300/20 to-green-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-md w-full space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start building momentum today
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 space-y-1"
                >
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Check className={`w-3 h-3 mr-1 ${passwordValidation.minLength ? 'opacity-100' : 'opacity-50'}`} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Check className={`w-3 h-3 mr-1 ${passwordValidation.hasUpperCase ? 'opacity-100' : 'opacity-50'}`} />
                      One uppercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Check className={`w-3 h-3 mr-1 ${passwordValidation.hasLowerCase ? 'opacity-100' : 'opacity-50'}`} />
                      One lowercase letter
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasNumbers ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Check className={`w-3 h-3 mr-1 ${passwordValidation.hasNumbers ? 'opacity-100' : 'opacity-50'}`} />
                      One number
                    </div>
                  </div>
                </motion.div>
              )}

              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${
                    errors.terms ? 'border-red-300' : ''
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                  I agree to use the system responsibly !!
                </label>
              </div>
            </div>
            {errors.terms && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {errors.terms}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: (isLoading || !passwordValidation.isValid) ? 1 : 1.02 }}
              whileTap={{ scale: (isLoading || !passwordValidation.isValid) ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
