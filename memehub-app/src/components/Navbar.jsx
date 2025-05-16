import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Feed", path: "/feed" },
  { name: "Analytics", path: "/analytics" }, // ✅ Analytics now available to all users
  { name: "Signup", path: "/signup" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // ✅ Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Generate random avatar if the user has no profile image
  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substr(2, 8);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
  };

  // ✅ Logout function
  const handleLogout = async () => {
    await signOut(auth);
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-extrabold tracking-wider drop-shadow-lg hover:text-pink-300 transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          JokeJunction
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-lg font-semibold">
          {navLinks.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-4 border-pink-400 text-pink-300 transition duration-300"
                    : "hover:text-pink-300 hover:border-b-4 hover:border-pink-400 transition duration-300"
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        </ul>

        {/* User Info & Logout Button */}
        {user ? (
          <div className="flex items-center space-x-4">
            {/* User Avatar & Name */}
            <div className="flex items-center space-x-2">
              <img
                src={user.photoURL || generateRandomAvatar()} // Fallback avatar
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-white"
              />
              <span className="font-semibold">
                {user.displayName || "User"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-lg shadow-md transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition duration-300"
          >
            Login
          </Link>
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-900">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to logout?
              </h3>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
