import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const IssueCard = ({ issue, index }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 0: // Low
        return {
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-100 dark:bg-green-900/30',
          label: 'Low',
          icon: CheckCircle2
        };
      case 1: // Medium
        return {
          color: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          label: 'Medium',
          icon: Clock
        };
      case 2: // High
        return {
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-100 dark:bg-red-900/30',
          label: 'High',
          icon: AlertCircle
        };
      default:
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          label: 'Unknown',
          icon: Clock
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 0: // To-do
        return {
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          label: 'To Do'
        };
      case 1: // In Progress
        return {
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          label: 'In Progress'
        };
      case 2: // Completed
        return {
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-100 dark:bg-green-900/30',
          label: 'Completed'
        };
      default:
        return {
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          label: 'Unknown'
        };
    }
  };

  const priorityConfig = getPriorityConfig(issue.priority);
  const statusConfig = getStatusConfig(issue.status);
  const PriorityIcon = priorityConfig.icon;

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border transition-all duration-200 cursor-grab active:cursor-grabbing ${
            snapshot.isDragging
              ? 'bg-white dark:bg-gray-700 shadow-2xl border-green-300 dark:border-green-700 rotate-2 scale-105'
              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-green-300 dark:hover:border-green-700'
          }`}
          whileHover={{ scale: snapshot.isDragging ? 1.05 : 1.02 }}
        >
          {/* Priority Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.color} flex items-center space-x-1`}>
              <PriorityIcon className="h-3 w-3" />
              <span>{priorityConfig.label}</span>
            </span>
          </div>

          {/* Issue Title */}
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
            {issue.name}
          </h4>

          {/* Issue Description */}
          {issue.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {issue.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(issue.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {/* Issue ID */}
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
              #{issue.id}
            </span>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};

export default IssueCard;
