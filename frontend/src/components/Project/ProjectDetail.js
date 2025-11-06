import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
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



const ProjectDetail = () => {
  const { projectId } = useParams();
  const { showApiResponse, showApiError } = useNotification();
  const [issues, setIssues] = useState([]);
  const [notes, setNotes] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  const fetchProject = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProject(response.data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to fetch project details');
    }
  }, [projectId]);

  // Fetch project issues
  const fetchIssues = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/issue/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIssues(response.data.issues || []);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to fetch issues');
    }
  }, [projectId]);

  // Fetch project notes
  const fetchNotes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/note/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotes(response.data.notes || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
    }
  }, [projectId]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProject(), fetchIssues(), fetchNotes()]);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      loadData();
    }
  }, [projectId, fetchProject, fetchIssues]);

  const updateIssueStatus = useCallback(async (issueId, newStatus) => {
    console.log('Drag and drop detected:', {
      issueId,
      newStatus,
      timestamp: new Date().toISOString()
    });

    // Optimistically update the UI first for better UX
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        (issue._id || issue.id) === issueId ? { ...issue, status: newStatus } : issue
      )
    );

    // Make API call to update status in backend
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/issue/${issueId}`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Silently update status - no notification needed for drag & drop
      console.log('Issue status updated successfully:', response.data);
      
      // Optionally refresh issues to ensure sync with backend
      // await fetchIssues();
      
    } catch (err) {
      console.error('Failed to update issue status:', err);
      showApiError(err, 'Failed to update issue status. Please try again.');
      
      // Revert the optimistic update if API call fails
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          (issue._id || issue.id) === issueId ? { 
            ...issue, 
            status: prevIssues.find(p => (p._id || p.id) === issueId)?.status || 0 
          } : issue
        )
      );
    }
  }, []);

  // Add new issue function
  const addIssue = useCallback(async (issueData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/issue/${projectId}`, 
        issueData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showApiResponse(response, `Issue "${issueData.name}" created successfully!`);
      
      // Refresh issues to get the new issue from backend
      await fetchIssues();
      
      return { success: true, message: 'Issue created successfully' };
      
    } catch (err) {
      console.error('Failed to create issue:', err);
      showApiError(err, 'Failed to create issue. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to create issue. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [projectId, fetchIssues]);

  // Edit issue function
  const editIssue = useCallback(async (issueId, issueData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/issue/${issueId}`, 
        issueData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showApiResponse(response, `Issue "${issueData.name}" updated successfully!`);
      
      // Refresh issues to get the updated data
      await fetchIssues();
      
      return { success: true, message: 'Issue updated successfully' };
      
    } catch (err) {
      console.error('Failed to update issue:', err);
      showApiError(err, 'Failed to update issue. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to update issue. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [fetchIssues, showApiResponse, showApiError]);

  // Delete issue function
  const deleteIssue = useCallback(async (issueId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/issue/${issueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      showApiResponse(response, 'Issue deleted successfully!');
      
      // Refresh issues to reflect the deletion
      await fetchIssues();
      
      return { success: true, message: 'Issue deleted successfully' };
      
    } catch (err) {
      console.error('Failed to delete issue:', err);
      showApiError(err, 'Failed to delete issue. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to delete issue. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [fetchIssues, showApiResponse, showApiError]);

  // Notes CRUD functions
  const addNote = useCallback(async (noteData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/note/${projectId}`, 
        noteData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showApiResponse(response, `Note "${noteData.name}" created successfully!`);
      
      // Refresh notes to get the new note from backend
      await fetchNotes();
      
      return { success: true, message: 'Note created successfully' };
      
    } catch (err) {
      console.error('Failed to create note:', err);
      showApiError(err, 'Failed to create note. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to create note. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [projectId, fetchNotes]);

  const updateNote = useCallback(async (noteId, noteData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/note/${noteId}`, 
        noteData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showApiResponse(response, 'Note updated successfully!');
      
      // Refresh notes to get the updated note from backend
      await fetchNotes();
      
      return { success: true, message: 'Note updated successfully' };
      
    } catch (err) {
      console.error('Failed to update note:', err);
      showApiError(err, 'Failed to update note. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to update note. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [fetchNotes]);

  const deleteNote = useCallback(async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/note/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      showApiResponse({ data: { status: 'success' } }, 'Note deleted successfully!');
      
      // Refresh notes to remove the deleted note from frontend
      await fetchNotes();
      
      return { success: true, message: 'Note deleted successfully' };
      
    } catch (err) {
      console.error('Failed to delete note:', err);
      showApiError(err, 'Failed to delete note. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to delete note. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [fetchNotes]);

  // Update project function
  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/project/${projectId}`, 
        projectData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      showApiResponse(response, 'Project updated successfully!');
      
      // Update the project state with the updated data
      setProject(response.data);
      
      return { success: true, message: 'Project updated successfully' };
      
    } catch (err) {
      console.error('Failed to update project:', err);
      showApiError(err, 'Failed to update project. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to update project. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [showApiResponse, showApiError]);

  // Delete project function
  const deleteProject = useCallback(async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      showApiResponse(response, 'Project deleted successfully!');
      
      return { success: true, message: 'Project deleted successfully', data: response.data };
      
    } catch (err) {
      console.error('Failed to delete project:', err);
      showApiError(err, 'Failed to delete project. Please try again.');
      
      const errorMessage = err.response?.data?.errors?.[0]?.msg || 'Failed to delete project. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, [showApiResponse, showApiError]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <ProjectSidebar 
          projectId={projectId} 
          project={project || staticProjectData} 
          issues={issues}
          notes={notes}
        />
        
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
                    onAddIssue={addIssue}
                    onEditIssue={editIssue}
                    onDeleteIssue={deleteIssue}
                  />
                } 
              />
              <Route 
                path="notes" 
                element={
                  <NotesManager 
                    notes={notes} 
                    onAddNote={addNote}
                    onUpdateNote={updateNote}
                    onDeleteNote={deleteNote}
                  />
                } 
              />
              <Route 
                path="settings" 
                element={
                  <ProjectSettings 
                    project={project} 
                    onUpdateProject={updateProject}
                    onDeleteProject={deleteProject}
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
