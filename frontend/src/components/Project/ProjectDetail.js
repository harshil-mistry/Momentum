import React, { useState, useCallback } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectSidebar from './ProjectSidebar';
import KanbanBoard from './KanbanBoard/KanbanBoard';
import IssuesManager from './IssuesManager/IssuesManager';
import NotesManager from './NotesManager/NotesManager';
import ProjectSettings from './ProjectSettings';

// Static project data
const staticProjectData = {
  id: '1',
  name: 'Website Redesign',
  description: 'Complete overhaul of the company website with modern design',
  createdAt: '2025-08-15T00:00:00.000Z',
  completionPercentage: 75,
  totalIssues: 12,
  completedIssues: 9,
  totalNotes: 5
};

const staticIssues = [
  {
    id: '1',
    name: 'Design new homepage layout',
    description: 'Create wireframes and mockups for the new homepage',
    status: 2, // Completed
    priority: 1, // Medium
    createdAt: '2025-08-16T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Implement responsive navigation',
    description: 'Build mobile-friendly navigation menu',
    status: 1, // In Progress
    priority: 2, // High
    createdAt: '2025-08-17T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Set up contact form',
    description: 'Create contact form with validation',
    status: 0, // To-do
    priority: 0, // Low
    createdAt: '2025-08-18T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'Optimize images for web',
    description: 'Compress and optimize all website images',
    status: 2, // Completed
    priority: 1, // Medium
    createdAt: '2025-08-19T00:00:00.000Z'
  },
  {
    id: '5',
    name: 'Test cross-browser compatibility',
    description: 'Ensure website works across all major browsers',
    status: 0, // To-do
    priority: 2, // High
    createdAt: '2025-08-20T00:00:00.000Z'
  },
  {
    id: '6',
    name: 'Set up analytics tracking',
    description: 'Implement Google Analytics and tracking pixels',
    status: 1, // In Progress
    priority: 1, // Medium
    createdAt: '2025-08-21T00:00:00.000Z'
  }
];

const staticNotes = [
  {
    id: '1',
    title: 'Design Guidelines',
    content: 'Use primary color: #10B981 (Green)\nSecondary colors: Blues and grays\nFont: Inter or similar modern sans-serif',
    createdAt: '2025-08-16T00:00:00.000Z',
    updatedAt: '2025-08-20T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Meeting Notes - Aug 18',
    content: 'Client feedback:\n- Wants darker header\n- Add testimonials section\n- Include pricing table\n- Mobile-first approach',
    createdAt: '2025-08-18T00:00:00.000Z',
    updatedAt: '2025-08-18T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Technical Requirements',
    content: 'Framework: React.js\nStyling: Tailwind CSS\nAnimations: Framer Motion\nHosting: Vercel\nCMS: Contentful (optional)',
    createdAt: '2025-08-17T00:00:00.000Z',
    updatedAt: '2025-08-19T00:00:00.000Z'
  }
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState(staticIssues);
  const [notes, setNotes] = useState(staticNotes);
  const [project, setProject] = useState(staticProjectData);

  const updateIssueStatus = useCallback((issueId, newStatus) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <ProjectSidebar projectId={projectId} project={project} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="kanban" replace />} />
              <Route 
                path="kanban" 
                element={
                  <KanbanBoard 
                    issues={issues} 
                    onUpdateIssueStatus={updateIssueStatus}
                  />
                } 
              />
              <Route 
                path="issues" 
                element={
                  <IssuesManager 
                    issues={issues} 
                    setIssues={setIssues}
                  />
                } 
              />
              <Route 
                path="notes" 
                element={
                  <NotesManager 
                    notes={notes} 
                    setNotes={setNotes}
                  />
                } 
              />
              <Route 
                path="settings" 
                element={
                  <ProjectSettings 
                    project={project} 
                    setProject={setProject}
                  />
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
