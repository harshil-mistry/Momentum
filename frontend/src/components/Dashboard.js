import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import CreateProjectModal from './CreateProjectModal';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Plus,
  Activity,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
            color: 'from-green-400 to-green-400' 
          },
          { 
            title: 'Total Issues', 
            value: totalIssues.toString(), 
            icon: AlertTriangle, 
            change: totalIssues > 0 ? `${totalIssues} created` : 'No issues yet', 
            color: 'from-blue-400 to-blue-400 ' 
          },
          { 
            title: 'Pending Issues', 
            value: pendingIssues.toString(), 
            icon: Clock, 
            change: pendingIssues > 0 ? `${pendingIssues} to resolve` : 'All caught up!', 
            color: 'from-orange-400 to-orange-400' 
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

  // Modal handlers
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleProjectCreated = () => {
    // Refresh both stats and projects after creating a new project
    fetchDashboardStats();
    fetchProjects();
  };

  // Navigate to project detail page
  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
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

        {/* Projects Grid */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Projects
            </h2>
            <motion.button
              onClick={handleOpenCreateModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Create Project</span>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsLoading ? (
              // Loading skeleton for project tiles
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="mb-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))
            ) : projects.length > 0 ? (
              projects.map((project, index) => {
                // Use the actual completion percentage from the API
                const completionPercentage = project.completionPercentage || 0;
                
                // Generate consistent colors based on project name
                const colors = [
                  'from-green-400 to-green-600',
                  'from-blue-400 to-blue-600',
                  'from-purple-400 to-purple-600',
                  'from-orange-400 to-orange-600',
                  'from-pink-400 to-pink-600',
                  'from-indigo-400 to-indigo-600'
                ];
                const colorIndex = project.name.length % colors.length;
                const cardColor = colors[colorIndex];

                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProjectClick(project._id)}
                    className="group cursor-pointer"
                  >
                    <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-green-300 dark:hover:border-green-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 flex-1 mr-3">
                          {project.name}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          completionPercentage === 100 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        }`}>
                          {completionPercentage === 100 ? 'Completed' : 'Active'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                          {project.description || ''}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Progress</span>
                          <span className="font-medium">{completionPercentage}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                            className={`h-2 bg-gradient-to-r ${cardColor} rounded-full`}
                          ></motion.div>
                        </div>
                      </div>
                      
                      {/* Deadline Information */}
                      {project.deadline && (
                        <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            project.deadlineStatus === 'overdue' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                              : project.deadlineStatus === 'due-today'
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                              : project.deadlineStatus === 'due-soon'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          }`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {project.isOverdue 
                              ? `Overdue by ${Math.abs(project.daysUntilDeadline)} days`
                              : project.daysUntilDeadline === 0
                              ? 'Due today'
                              : `${project.daysUntilDeadline} days left`
                            }
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Due: {new Date(project.deadline).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created: {new Date(project.createdAt || Date.now()).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>
                            {project.completedIssues || 0}/{project.totalIssues || 0} issues
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 px-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <div className="w-24 h-24 mx-auto mb-6 p-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg">
                    <BarChart3 className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No projects yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Get started by creating your first project and begin managing your tasks efficiently.
                  </p>
                  <motion.button
                    onClick={handleOpenCreateModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    Create Your First Project
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onProjectCreated={handleProjectCreated}
      />
    </motion.div>
  );
};

export default Dashboard;
