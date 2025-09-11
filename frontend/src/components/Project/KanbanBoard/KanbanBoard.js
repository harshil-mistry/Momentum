import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ issues, onUpdateIssueStatus }) => {
  const handleDragEnd = (result) => {
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
  };

  // Group issues by status
  const groupedIssues = {
    todo: issues.filter(issue => issue.status === 0),
    inprogress: issues.filter(issue => issue.status === 1),
    completed: issues.filter(issue => issue.status === 2)
  };

  const columns = [
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
      className="h-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kanban Board
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Drag and drop issues between columns to update their status
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Issue</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column, index) => (
            <motion.div
              key={column.id}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
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
