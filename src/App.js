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
import MenteeProfileEdit from "./pages/mentee/MenteeProfileEdit";
import MentorProfileEdit from "./pages/mentor/MentorProfileEdit";
import MentorList from './pages/mentee/MentorList';
import IncomingRequests from './pages/mentor/IncomingRequests';
import CalendarPage from './pages/CalendarPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackChartsPage from './pages/FeedbackChartsPage';



function App() {
  // Örnek geri bildirim verileri. Kendi verilerinizi buradan besleyebilirsiniz.
  // Bu verileri FeedbackChartsPage.jsx'e taşıyacağım
  // const sampleFeedbackData = [
  //   { rating: 5 },
  //   { rating: 4 },
  //   { rating: 5 },
  //   { rating: 3 },
  //   { rating: 2 },
  //   { rating: 5 },
  //   { rating: 4 },
  //   { rating: 1 },
  //   { rating: 3 },
  //   { rating: 4 },
  //   { rating: 5 },
  // ];

  return (
    <AuthProvider>
      <Router>
        <div>
          <h1>Mentor-Mentee Network</h1>

          {/* Geri Bildirim Puanları Grafiği Bölümü - Buradan kaldırıyorum */}
          {/* <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Geri Bildirim Puanları Grafiği</h2> */}
          {/* <FeedbackChart feedbackData={sampleFeedbackData} /> */}

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
            <Route path="/mentee/profile/edit" element={<MenteeProfileEdit />} />
            <Route path="/mentor/profile/edit" element={<MentorProfileEdit />} />

            <Route path="/mentee/mentor-list" element={<MentorList />} />
            <Route path="/mentor/incoming-requests" element={<IncomingRequests />} />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/feedback/:userId"
              element={
                <PrivateRoute>
                  <FeedbackPage />
                </PrivateRoute>
              }
            />

            {/* Yeni Geri Bildirim Grafikleri Sayfası Rotası */}
            <Route
              path="/feedback-charts"
              element={
                <PrivateRoute>
                  <FeedbackChartsPage />
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
