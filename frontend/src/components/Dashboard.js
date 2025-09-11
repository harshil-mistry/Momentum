import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Plus,
  Activity,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats function
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/users/dashboard-stats');
      
      if (response.data.status === 'success') {
        const { totalProjects, totalIssues, pendingIssues } = response.data.data;
        
        const statsData = [
          { 
            title: 'Total Projects', 
            value: totalProjects.toString(), 
            icon: BarChart3, 
            change: totalProjects > 0 ? `${totalProjects} active` : 'No projects yet', 
            color: 'from-green-400 to-green-600' 
          },
          { 
            title: 'Total Issues', 
            value: totalIssues.toString(), 
            icon: AlertTriangle, 
            change: totalIssues > 0 ? `${totalIssues} created` : 'No issues yet', 
            color: 'from-blue-400 to-blue-600' 
          },
          { 
            title: 'Pending Issues', 
            value: pendingIssues.toString(), 
            icon: Clock, 
            change: pendingIssues > 0 ? `${pendingIssues} to resolve` : 'All caught up!', 
            color: 'from-orange-400 to-orange-600' 
          }
        ];
        
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
      // Fallback to default stats
      setStats([
        { title: 'Total Projects', value: '0', icon: BarChart3, change: 'No data', color: 'from-green-400 to-green-600' },
        { title: 'Total Issues', value: '0', icon: AlertTriangle, change: 'No data', color: 'from-blue-400 to-blue-600' },
        { title: 'Pending Issues', value: '0', icon: Clock, change: 'No data', color: 'from-orange-400 to-orange-600' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects function
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await axios.get('/project');
      
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardStats();
    fetchProjects();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    fetchDashboardStats();
    fetchProjects();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Here's what's happening with your projects today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button 
                onClick={handleRefresh}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh Dashboard"
              >
                <Activity className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <button className="p-2 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="p-6 rounded-xl shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 rounded mb-3 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-8 rounded mb-2 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 rounded w-3/4 bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-500">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="rounded-xl shadow-lg p-6 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Projects
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {projectsLoading ? (
                  // Loading skeleton for projects
                  [...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-pulse"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16"></div>
                      </div>
                      <div className="mb-3">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    </div>
                  ))
                ) : projects.length > 0 ? (
                  projects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-lg transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          Active
                        </span>
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description
                          }
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Created: {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-3 w-3" />
                          <span>Project</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No projects yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Get started by creating your first project
                    </p>
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md">
                      Create Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Project Overview */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl shadow-lg p-6 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Activity className="h-5 w-5" />
                  <span>Overview</span>
                </h2>
              </div>
              
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-400">
                          Active Projects
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {projects.length} project{projects.length !== 1 ? 's' : ''} in progress
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400">
                      {projects.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                          This Month
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-500">
                          Projects created recently
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                      {projects.filter(p => {
                        const projectDate = new Date(p.createdAt || Date.now());
                        const monthAgo = new Date();
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return projectDate > monthAgo;
                      }).length}
                    </span>
                  </div>
                </div>

                {/* Recent Project Names */}
                {projects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Recent Projects
                    </h3>
                    <div className="space-y-2">
                      {projects.slice(0, 3).map((project, index) => (
                        <div
                          key={project._id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {project.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="mt-8"
        >
          <div className="rounded-xl shadow-lg p-6 transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  icon: Plus, 
                  label: 'New Project', 
                  color: 'from-green-500 to-green-600',
                  description: 'Start a new project'
                },
                { 
                  icon: AlertTriangle, 
                  label: 'Create Issue', 
                  color: 'from-orange-500 to-orange-600',
                  description: 'Track bugs and tasks'
                },
                { 
                  icon: BarChart3, 
                  label: 'View Projects', 
                  color: 'from-blue-500 to-blue-600',
                  description: 'Manage all projects'
                },
                { 
                  icon: Settings, 
                  label: 'Settings', 
                  color: 'from-gray-500 to-gray-600',
                  description: 'Account preferences'
                }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white transition-all duration-200 shadow-sm hover:shadow-md flex flex-col items-center space-y-2 relative group`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {action.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
