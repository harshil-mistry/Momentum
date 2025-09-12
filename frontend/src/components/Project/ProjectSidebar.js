import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Kanban, 
  List, 
  FileText, 
  Settings,
  BarChart3,
  ArrowLeft,
  Calendar,
  TrendingUp
} from 'lucide-react';

const ProjectSidebar = ({ projectId, project }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: 'Kanban Board',
      path: `/project/${projectId}/kanban`,
      icon: Kanban,
      description: 'Visual task management'
    },
    {
      name: 'Issues',
      path: `/project/${projectId}/issues`,
      icon: List,
      description: 'Manage all issues',
      badge: 6 // Static count for demo
    },
    {
      name: 'Notes',
      path: `/project/${projectId}/notes`,
      icon: FileText,
      description: 'Project documentation',
      badge: 3 // Static count for demo
    },
    {
      name: 'Settings',
      path: `/project/${projectId}/settings`,
      icon: Settings,
      description: 'Project configuration'
    }
  ];

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Back to Dashboard */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium text-sm">Back to Dashboard</span>
        </Link>
      </div>

      {/* Project Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {project?.name || 'Website Redesign'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {project?.description || 'Complete overhaul of the company website with modern design'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
            </div>
            <span className="text-xs font-bold text-green-600 dark:text-green-400">
              {project?.completionPercentage || 75}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project?.completionPercentage || 75}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            ></motion.div>
          </div>
        </div>

        {/* Creation Date */}
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>
            Created {new Date(project?.createdAt || '2025-08-15T00:00:00.000Z').toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.name}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                    <div>
                      <div className={`font-medium ${isActive ? 'text-white' : ''}`}>
                        {item.name}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        isActive 
                          ? 'text-green-100' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-green-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-green-100 group-hover:text-green-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">9</div>
            <div className="text-xs text-green-600 dark:text-green-400">Done</div>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">3</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
