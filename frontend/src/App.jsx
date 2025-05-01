import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginAndRegister from './pages/LoginAndRegister.jsx';

// Placeholder for Dashboard component - will be implemented later
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">News Dashboard</h1>
      <p>Welcome to your personalized news feed!</p>
      {/* News content will go here */}
    </div>
  );
};

export default function App() {
  // Simple auth state - in a real app, you'd use context or state management library
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Function to handle authentication status
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginAndRegister onLoginSuccess={handleLogin} />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}