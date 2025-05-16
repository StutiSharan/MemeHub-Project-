import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Feed", path: "/feed" },
  { name: "Analytics", path: "/analytics" },
  // { name: "Dashboard", path: "/dashboard" },
  { name: "Signup", path: "/signup" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const naviagte = useNavigate();
  const auth = getAuth();
  //to change state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // logout fun
  const handleLogout = async () => {
    await signOut(auth);
    setShowLogoutModal(false);
    naviagte("/");
  };
  return (
   <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center px-6 py-2">
    {/* Logo */}
    <NavLink
      to="/"
      className="flex flex-col items-center text-xl font-extrabold tracking-wider drop-shadow-lg hover:text-pink-300 transition duration-300 leading-none"
      onClick={() => setMenuOpen(false)}
    >
      <img
        src="/logo.png"
        alt="JokeJunction Logo"
        className="w-10 h-10" // reduced from w-20 h-20
      />
      <span className="mt-0 text-sm sm:text-base">JokeJunction</span>
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
        </ul>

        {/* { logout button only visible when user is loggedin}  */}
        {user && (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="ml-4 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-semibold text-lg shadow-md transition duration-300"
          >
            Logout
          </button>
        )}
        {/* Logout Confirmation Modal */}
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col space-y-1.5 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white rounded transform transition duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded transition duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded transform transition duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-indigo-800/95 backdrop-blur-sm shadow-inner space-y-4 py-4 px-6 text-lg font-semibold">
          {navLinks.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block border-l-4 border-pink-400 pl-3 text-pink-300"
                    : "block hover:text-pink-300 hover:border-l-4 hover:border-pink-400 pl-3 transition duration-300"
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
