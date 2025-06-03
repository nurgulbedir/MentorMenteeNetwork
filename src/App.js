// src/App.js
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MentorProfile from "./pages/mentor/MentorProfile";
import MenteeProfile from "./pages/mentee/MenteeProfile";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";

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
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentor/profile"
              element={
                <PrivateRoute>
                  <MentorProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentee/profile"
              element={
                <PrivateRoute>
                  <MenteeProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
