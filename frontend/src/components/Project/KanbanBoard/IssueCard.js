import React, { memo, useMemo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const IssueCard = memo(({ issue, index }) => {
  // Memoize priority configuration to avoid recalculating on every render
  const priorityConfig = useMemo(() => {
    switch (issue.priority) {
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
  }, [issue.priority]);

  // Memoize formatted date to avoid recalculating
  const formattedDate = useMemo(() => {
    return new Date(issue.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }, [issue.createdAt]);

  const PriorityIcon = priorityConfig.icon;

  return (
    <Draggable draggableId={issue._id || issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-lg border cursor-grab active:cursor-grabbing ${
            snapshot.isDragging
              ? 'bg-white dark:bg-gray-700 dragging-optimized border-green-300 dark:border-green-700 z-50'
              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all duration-150'
          }`}
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
              <span>{formattedDate}</span>
            </div>
            
            {/* Issue ID */}
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
              #{issue._id?.slice(-6) || issue.id}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
});

IssueCard.displayName = 'IssueCard';

export default IssueCard;
