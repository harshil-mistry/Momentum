import React, { useMemo, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import KanbanColumn from './KanbanColumn';
import './KanbanOptimizations.css';

const KanbanBoard = ({ issues, onUpdateIssueStatus }) => {
  // Memoize the drag end handler to prevent recreation on every render
  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Map column IDs to status numbers
    const statusMap = {
      'todo': 0,
      'inprogress': 1,
      'completed': 2
    };

    const newStatus = statusMap[destination.droppableId];
    onUpdateIssueStatus(draggableId, newStatus);
  }, [onUpdateIssueStatus]);

  // Memoize grouped issues to prevent re-calculation on every render
  const groupedIssues = useMemo(() => ({
    todo: issues.filter(issue => issue.status === 0),
    inprogress: issues.filter(issue => issue.status === 1),
    completed: issues.filter(issue => issue.status === 2)
  }), [issues]);

  // Memoize columns configuration to prevent recreation
  const columns = useMemo(() => [
    {
      id: 'todo',
      title: 'To Do',
      issues: groupedIssues.todo,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      headerColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      issues: groupedIssues.inprogress,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      headerColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      id: 'completed',
      title: 'Completed',
      issues: groupedIssues.completed,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      headerColor: 'text-green-600 dark:text-green-400'
    }
  ], [groupedIssues]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kanban Board
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Drag and drop issues between columns to update their status
          </p>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full kanban-drag-optimization">
          {columns.map((column, index) => (
            <motion.div
              key={column.id}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
            >
              <KanbanColumn column={column} />
            </motion.div>
          ))}
        </div>
      </DragDropContext>
    </motion.div>
  );
};

export default KanbanBoard;