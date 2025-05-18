import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// const navLinks = user
//   ? [
//       { name: "Home", path: "/" },
//       { name: "Feed", path: "/feed" },
//       { name: "Dashboard", path: "/dashboard" },
//     ]
//   : [
//       { name: "Analytics", path: "/login" }, // ✅ Analytics now available to all users
//       { name: "Signup", path: "/signup" },
//     ];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // ✅ Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      // ✅ If user has a profile picture, use it. Otherwise, store a generated avatar once.
      if (authUser) {
        setUserAvatar(authUser.photoURL || generateRandomAvatar(authUser.uid));
      }
    });

    return () => unsubscribe();
  }, []);

  const adminEmail = "anjali@gmail.com"; // 🔥 Replace with actual admin email
  const navLinks = user
    ? [
        { name: "Home", path: "/" },
        { name: "Feed", path: "/feed" },
        { name: "LeaderBoard", path: "/leaderBoard" },
        ...(user.email === adminEmail
          ? [{ name: "Analytics", path: "/analytics" }]
          : []),
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Feed", path: "/feed" },
        { name: "LeaderBoard", path: "/leaderBoard" },
        { name: "Signup", path: "/signup" },
      ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);

        // ✅ Hardcoded Admin Email Check
        const adminEmail = "anjali@gmail.com"; // Replace with actual admin email
        if (authUser.email === adminEmail) {
          navigate("/analytics"); // ✅ Redirect Admin to Analytics Page
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Generate random avatar if the user has no profile image
 const generateRandomAvatar = (seed) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

  // ✅ Logout function
  const handleLogout = async () => {
    await signOut(auth);
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-8">
        {" "}
        {/* Reduced py-4 → py-2 */}
        {/* Logo */}
        <NavLink
          to="/"
          className="flex flex-col items-center text-xl font-extrabold tracking-wider drop-shadow-lg hover:text-pink-300 transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/logo.png"
            alt="JokeJunction Logo"
            className="w-16 h-16 mb-0" // Increased size, removed bottom margin
          />
          <span className="-mt-4 mb-2">JokeJunction</span>{" "}
          {/* Optional: slight shift up if needed */}
        </NavLink>
        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-xl font-semibold">
          {navLinks.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-4 border-pink-400 text-pink-300 transition duration-300"
                    : "hover:text-pink-300 hover:border-b-4 hover:border-pink-400 transition duration-300"
                }
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </NavLink>
            </li>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "border-b-4 border-pink-400 text-pink-300 transition duration-300"
                  : "hover:text-pink-300 hover:border-b-4 hover:border-pink-400 transition duration-300"
              }
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
        </ul>
        {/* User Info & Logout Button */}
        {user ? (
          <div className=" hidden md:flex items-center space-x-4">
            {/* User Avatar & Name */}
            <div className="flex items-center space-x-2">
              <img
  src={user.photoURL || generateRandomAvatar(user.uid || user.email)}
  alt="User Avatar"
  className="w-10 h-10 rounded-full border border-white"
/>
<span className="font-semibold">
  {user.email === "anjali@gmail.com" ? "Admin" : user.displayName || "User"}
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
        {/* 🏆 Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "" : "☰"} {/* Menu Icon */}
        </button>
        {/* 🏆 Mobile Sidebar (Visible when `menuOpen === true`) */}
        {menuOpen && (
          <div className="fixed inset-0  bg-opacity-50 z-50 flex">
            <div className="w-3/4 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-10 shadow-inner  p-6 flex flex-col space-y-6">
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-black bg-gray-300 rounded-full px-2 text-2xl"
              >
                ✕
              </button>
              <nav className="flex flex-col space-y-4">
                {navLinks.map(({ name, path }) => (
                  <NavLink
                    key={name}
                    to={path}
                    className="text-lg font-semibold text-white hover:text-indigo-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    {name}
                  </NavLink>
                ))}
                {user && (
                  <NavLink
                    to="/dashboard"
                    className="text-lg text-white font-semibold"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                )}
              </nav>
              {user ? (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
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
