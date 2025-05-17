import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import LoginAdmin from "./LoginFormAdmin";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/dashboard"); // Navigate to dashboard or home page after login
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
   <div className="min-h-[500px] bg-white shadow-lg rounded-lg px-10 py-8 w-full max-w-md bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white flex flex-col justify-center">

        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide text-indigo-100">
          User Login Page
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-indigo-400 placeholder-gray-700 placeholder-opacity-100 text-gray-900"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring focus:ring-indigo-400 placeholder-gray-700 placeholder-opacity-100 text-gray-900"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-lg shadow-md transition duration-300"
          >
            Login
          </button>
          {/* Success Popup */}
          {showPopup && (
            <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
              ✅ Login Successful! Redirecting... Welcome {email}
            </div>
          )}

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-pink-300 hover:underline">
              ➡️ Sign up here
            </NavLink>
          </p>
        </form>
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}
      </div>
    
  );
};

export default LoginUser;
