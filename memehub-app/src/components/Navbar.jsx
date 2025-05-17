import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Feed", path: "/feed" },
  { name: "Analytics", path: "/analytics" },
  { name: "Signup", path: "/signup" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substr(2, 8);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-8 py-2">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex flex-col items-center text-xl font-extrabold tracking-wider drop-shadow-lg hover:text-pink-300 transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/logo.png"
            alt="JokeJunction Logo"
            className="w-16 h-16"
          />
          <span className="-mt-4 mb-2">JokeJunction</span>
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
              >
                {name}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink
                to="/dashboard"
                className="hover:text-pink-300 transition duration-300"
              >
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        {/* Hamburger menu icon (Mobile only) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12" // cross icon
                  : "M4 6h16M4 12h16M4 18h16" // hamburger icon
              }
            />
          </svg>
        </button>

        {/* User Info (Desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <img
                  src={user.photoURL || generateRandomAvatar()}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border border-white"
                />
                <span className="font-semibold">
                  {user.displayName || "User"}
                </span>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-lg shadow-md transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-800 px-8 py-4 space-y-4">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-pink-300 font-semibold border-l-4 border-pink-400 pl-2"
                  : "block hover:text-pink-300 transition duration-300"
              }
            >
              {name}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-pink-300 transition duration-300"
            >
              Dashboard
            </NavLink>
          )}
          {user ? (
            <button
              onClick={() => {
                setShowLogoutModal(true);
                setMenuOpen(false);
              }}
              className="block w-full text-left mt-2 text-red-400 hover:text-red-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-white font-semibold hover:text-pink-300"
            >
              Login
            </Link>
          )}
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
    </nav>
  );
};

export default Navbar;
