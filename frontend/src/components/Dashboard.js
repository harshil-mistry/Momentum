import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const stats = [
    { 
      title: 'Total Projects', 
      value: '24', 
      icon: BarChart3, 
      change: '+12%', 
      color: 'from-green-400 to-green-600' 
    },
    { 
      title: 'Team Members', 
      value: '18', 
      icon: Users, 
      change: '+5%', 
      color: 'from-blue-400 to-blue-600' 
    },
    { 
      title: 'Completed Tasks', 
      value: '156', 
      icon: CheckCircle, 
      change: '+8%', 
      color: 'from-emerald-400 to-emerald-600' 
    },
    { 
      title: 'Pending Tasks', 
      value: '23', 
      icon: Clock, 
      change: '-3%', 
      color: 'from-orange-400 to-orange-600' 
    }
  ];

  const recentProjects = [
    { name: 'E-commerce Platform', progress: 85, status: 'In Progress', team: 5 },
    { name: 'Mobile App Redesign', progress: 62, status: 'In Progress', team: 3 },
    { name: 'Marketing Campaign', progress: 100, status: 'Completed', team: 4 },
    { name: 'API Integration', progress: 45, status: 'In Progress', team: 2 }
  ];

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
      className={`min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back, {user?.name}! 👋
              </h1>
              <p className={`mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Here's what's happening with your projects today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900'
              } shadow-sm hover:shadow-md`}>
                <Bell className="h-5 w-5" />
              </button>
              <button className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-600 hover:text-gray-900'
              } shadow-sm hover:shadow-md`}>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Projects
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-lg transition-all duration-200 ${
                      isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Progress: {project.progress}%
                      </span>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Team: {project.team} members
                      </span>
                    </div>
                    
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants}>
            <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold flex items-center space-x-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { action: 'Task completed', project: 'E-commerce Platform', time: '2 hours ago' },
                  { action: 'New team member added', project: 'Mobile App Redesign', time: '4 hours ago' },
                  { action: 'Project milestone reached', project: 'Marketing Campaign', time: '1 day ago' },
                  { action: 'File uploaded', project: 'API Integration', time: '2 days ago' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {activity.action}
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {activity.project} • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="mt-8"
        >
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <h2 className={`text-xl font-semibold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Plus, label: 'New Project', color: 'from-green-500 to-green-600' },
                { icon: Users, label: 'Add Team Member', color: 'from-blue-500 to-blue-600' },
                { icon: Calendar, label: 'Schedule Meeting', color: 'from-purple-500 to-purple-600' },
                { icon: TrendingUp, label: 'View Reports', color: 'from-orange-500 to-orange-600' }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white transition-all duration-200 shadow-sm hover:shadow-md flex flex-col items-center space-y-2`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
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
