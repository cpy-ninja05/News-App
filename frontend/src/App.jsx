import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginAndRegister from './pages/LoginAndRegister.jsx';
import Preferences from './pages/Preferences.jsx';
import Home from './pages/Home.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/register" element={<LoginAndRegister  />} />
        <Route path="/preferences" element={<Preferences />} />
        {/* Redirect to login if not authenticated */}
      </Routes>
    </Router>
  );
}

export default App;