import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/Project/ProjectDetail';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/Notifications/NotificationContainer';
import NotFoundPage from './components/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/project/:projectId/*" element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                } />
                {/* 404 Catch-all route - must be last */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <NotificationContainer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
