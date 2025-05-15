import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Article from './pages/Article.jsx';
import Business from './pages/Business.jsx';
import Entertainment from './pages/Entertainment.jsx';
import Health from './pages/Health.jsx';
import Home from './pages/Home.jsx';
import LoginAndRegister from './pages/LoginAndRegister.jsx';
import Preferences from './pages/Preferences.jsx';
import Science from './pages/Science.jsx';
import SearchResult from './pages/SearchResult.jsx';
import Sports from './pages/Sports.jsx';
import Technology from './pages/Technology.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/loginandregister" />} />
        <Route path="/loginandregister" element={<LoginAndRegister />} />
        <Route path="/preferences/:email" element={<Preferences />} />
        <Route path="/home" element={<Home />} />
        <Route path="/article" element={<Article />} />
        <Route path="/business" element={<Business />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/health" element={<Health />} />
        <Route path="/science" element={<Science />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/:searchQuery" element={<SearchResult />} />
      </Routes>
    </Router>
  );
}

export default App;