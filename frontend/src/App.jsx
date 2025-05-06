import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LoginAndRegister from './pages/LoginAndRegister.jsx';
import Preferences from './pages/Preferences.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/register" element={<LoginAndRegister  />} />
        <Route path="/preferences/:email" element={<Preferences />} />
    
      </Routes>
    </Router>
  );
}

export default App;