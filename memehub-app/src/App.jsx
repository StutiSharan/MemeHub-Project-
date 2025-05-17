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


const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
<<<<<<< HEAD
=======

>>>>>>> b9ba04d30735dff4a944a67791c9d2fe48fa6b16
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
 <Route path="/analytics" element={<Analytics />} />
            <Route path="/upload" element={<UploadMeme />} />
            <Route path="/generate" element={<MemeGenerator />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
