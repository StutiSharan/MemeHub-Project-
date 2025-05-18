import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadMeme from "./components/UploadMems";
import MemeGenerator from "./pages/MemeGenerator";
import AdminDashboard from "./AdminPage/AdminCredentials";
import LeaderBoardPag from "./components/LeaderBoardPag";


const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            {/* Regular user can Acess these pages */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Only- Can see verything */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/leaderBoard" element={<LeaderBoardPag />} />
            <Route path="/upload" element={<UploadMeme />} />
            <Route path="/generate" element={<MemeGenerator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
