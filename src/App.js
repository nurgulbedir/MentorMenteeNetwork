// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import MentorProfile from "./pages/mentor/MentorProfile";
import MenteeProfile from "./pages/mentee/MenteeProfile";

function App() {
  return (
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
  );
}

export default App;

