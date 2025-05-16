import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Feed', path: '/feed' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Dashboard', path: '/dashboard' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-extrabold tracking-wider drop-shadow-lg hover:text-pink-300 transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          MemeHub
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-lg font-semibold">
          {navLinks.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-4 border-pink-400 text-pink-300 transition duration-300'
                    : 'hover:text-pink-300 hover:border-b-4 hover:border-pink-400 transition duration-300'
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col space-y-1.5 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white rounded transform transition duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded transition duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded transform transition duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
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
                    ? 'block border-l-4 border-pink-400 pl-3 text-pink-300'
                    : 'block hover:text-pink-300 hover:border-l-4 hover:border-pink-400 pl-3 transition duration-300'
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
