import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-6 mt-auto shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm md:text-base px-6">
        <p className="mb-2 md:mb-0 select-none">
          © {new Date().getFullYear()} MemeHub. All rights reserved.
        </p>
        <p className="opacity-70">
          Crafted with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
