import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LoginAndRegister from './pages/LoginAndRegister.jsx';
import Preferences from './pages/Preferences.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/loginandregister" />} />
        <Route path="/loginandregister" element={<LoginAndRegister />} />
        <Route path="/preferences/:email" element={<Preferences />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
