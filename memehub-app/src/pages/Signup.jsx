import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../utils/firebaseConfig";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      // ✅ Store user in Firestore (No role)
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
      });

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-gray-900">
      <div className="bg-white shadow-lg rounded-lg px-10 py-8 w-full max-w-md bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide text-indigo-100">
          Sign Up
        </h2>

        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-gray-100 border text-gray-900"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-100 border text-gray-900"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full p-3 rounded-lg bg-gray-100 border text-gray-900"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg"
          >
            Sign Up
          </button>

          {showPopup && (
            <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50">
              ✅ Signup Successful! Redirecting...
            </div>
          )}

          <p className="text-center mt-4">
            Already have an account?{" "}
            <NavLink to="/login" className="text-pink-300 hover:underline">
              ➡️ Log in here
            </NavLink>
          </p>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
