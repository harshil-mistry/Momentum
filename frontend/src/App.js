import React from 'react';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Navbar />
        <HomePage />
      </div>
    </ThemeProvider>
  );
}

export default App;
