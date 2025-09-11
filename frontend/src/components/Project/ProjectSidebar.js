import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Kanban, 
  List, 
  FileText, 
  Settings,
  BarChart3
} from 'lucide-react';

const ProjectSidebar = ({ projectId }) => {
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
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Project Info */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              Website Redesign
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              75% Complete
            </p>
          </div>
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
