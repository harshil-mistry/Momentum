import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import IssueCard from './IssueCard';

const KanbanColumn = ({ column }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`p-4 rounded-t-xl border-t border-l border-r ${column.borderColor} ${column.bgColor}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${column.headerColor}`}>
            {column.title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${column.bgColor} ${column.headerColor}`}>
              {column.issues.length}
            </span>
            <button
              className={`p-1 rounded hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${column.headerColor}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-4 border-l border-r border-b rounded-b-xl transition-colors duration-200 ${
              column.borderColor
            } ${
              snapshot.isDraggingOver
                ? column.bgColor + ' bg-opacity-50'
                : 'bg-white dark:bg-gray-800'
            }`}
            style={{ minHeight: '500px' }}
          >
            <div className="space-y-3">
              {column.issues.map((issue, index) => (
                <IssueCard key={issue.id} issue={issue} index={index} />
              ))}
              {provided.placeholder}
              
              {/* Empty State */}
              {column.issues.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                    <Plus className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium">No issues yet</p>
                  <p className="text-xs text-center mt-1">
                    Drag issues here or click the + button to add new ones
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
