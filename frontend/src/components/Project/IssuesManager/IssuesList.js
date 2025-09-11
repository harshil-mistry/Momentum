import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle2, Clock, Edit, Trash2, MoreVertical } from 'lucide-react';

const IssuesList = ({ issues, setIssues }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 0:
        return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Low', icon: CheckCircle2 };
      case 1:
        return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Medium', icon: Clock };
      case 2:
        return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'High', icon: AlertCircle };
      default:
        return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30', label: 'Unknown', icon: Clock };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 0:
        return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'To Do' };
      case 1:
        return { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'In Progress' };
      case 2:
        return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Completed' };
      default:
        return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30', label: 'Unknown' };
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (issues.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No issues found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          No issues match your current filters. Try adjusting your search criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div className="col-span-4">Issue</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {issues.map((issue, index) => {
          const priorityConfig = getPriorityConfig(issue.priority);
          const statusConfig = getStatusConfig(issue.status);
          const PriorityIcon = priorityConfig.icon;

          return (
            <motion.div
              key={issue.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
              className="px-6 py-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Issue Info */}
                <div className="col-span-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {issue.name}
                  </h4>
                  {issue.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {issue.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    #{issue.id}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Priority */}
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.color} flex items-center space-x-1 w-fit`}>
                    <PriorityIcon className="h-3 w-3" />
                    <span>{priorityConfig.label}</span>
                  </span>
                </div>

                {/* Created Date */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(issue.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      title="Edit Issue"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      title="Delete Issue"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      title="More Options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default IssuesList;
