import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import MentorProfile from './pages/MentorProfile';
import MenteeProfile from './pages/MenteeProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mentor-profile" element={<MentorProfile />} />
        <Route path="/mentee-profile" element={<MenteeProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
