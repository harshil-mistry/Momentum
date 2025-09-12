import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';

const NotesList = ({ notes, onUpdateNote, onDeleteNote, onCreateNote, viewMode }) => {
  const [selectedNote, setSelectedNote] = useState(null);

  const handleUpdateNote = async (noteId, updatedNote) => {
    if (onUpdateNote) {
      await onUpdateNote(noteId, updatedNote);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (onDeleteNote) {
      await onDeleteNote(noteId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first note to start documenting important information.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateNote}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create First Note
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      }
    >
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            variants={itemVariants}
            layout
            exit="exit"
          >
            <NoteCard
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotesList;
