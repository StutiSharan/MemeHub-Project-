import React from 'react';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-10 shadow-inner mt-auto">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">

          {/* Branding & Description */}
          <div className="md:w-1/3 space-y-4">
            <h2 className="text-2xl font-extrabold tracking-wide select-none">JokeJunction</h2>
            <p className="text-gray-300 max-w-sm leading-relaxed">
              Your ultimate destination for meme culture — sharing, laughing, and connecting through the funniest content on the web.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="md:w-1/4 grid grid-cols-2 gap-4 text-gray-300">
            <div>
              <h3 className="mb-2 font-semibold text-white">Explore</h3>
              <ul className="space-y-1">
                <li>
                  <a href="/feed" className="hover:text-indigo-400 transition-colors duration-200">Browse Feed</a>
                </li>
                <li>
                  <a href="/" className="hover:text-indigo-400 transition-colors duration-200">Home</a>
                </li>
                <li>
                  <a href="/analytics" className="hover:text-indigo-400 transition-colors duration-200">Analytics</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">Company</h3>
              <ul className="space-y-1">
                <li>
                  <a href="/feed" className="hover:text-indigo-400 transition-colors duration-200">Feed</a>
                </li>
                <li>
                  <a href="/signup" className="hover:text-indigo-400 transition-colors duration-200">Sign Up</a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Newsletter & Social */}
          <div className="md:w-1/3 space-y-6">
            <h3 className="font-semibold text-white">Subscribe to our newsletter</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing!');
              }}
              className="flex flex-col sm:flex-row gap-3"
              aria-label="Subscribe to newsletter"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 px-5 py-2 rounded-md font-semibold shadow-md"
              >
                Subscribe
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex gap-6 text-gray-300">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors duration-200">
                <Instagram size={24} />
              </a>
              <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors duration-200">
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm select-none">
          <p>© {new Date().getFullYear()} MemeHub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Crafted with <span aria-label="love">❤️</span> using React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
