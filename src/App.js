// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MentorProfile from "./pages/mentor/MentorProfile";
import MenteeProfile from "./pages/mentee/MenteeProfile";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <h1>Mentor-Mentee Network</h1>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/mentor/profile" element={<MentorProfile />} />
            <Route path="/mentee/profile" element={<MenteeProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

