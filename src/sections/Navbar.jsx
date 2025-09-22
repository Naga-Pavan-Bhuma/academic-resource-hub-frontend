// src/sections/Navbar.jsx
import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 transition-all duration-500 ease-in-out hover:shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:py-6">
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 cursor-pointer transform hover:scale-105 transition-transform duration-300">
          Academic Resource Hub
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center font-medium text-gray-700">
          <a
            href="#features"
            className="relative group transition-all duration-300 hover:text-blue-600"
          >
            Features
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </a>
          <a
            href="#how-it-works"
            className="relative group transition-all duration-300 hover:text-blue-600"
          >
            How it Works
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </a>
          <a
            href="#resources"
            className="relative group transition-all duration-300 hover:text-blue-600"
          >
            Resources
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </a>
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex gap-4">
          <button className="px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
            Login
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none relative w-8 h-8 flex flex-col justify-between items-center"
          >
            <span
              className={`block h-0.5 w-8 bg-gray-700 rounded transform transition duration-300 ${
                menuOpen ? "rotate-45 translate-y-3" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-gray-700 rounded transition duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-gray-700 rounded transform transition duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-3" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg overflow-hidden transition-max-height duration-500 ${
          menuOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center py-4 gap-4 font-medium text-gray-700">
          <a href="#features" className="hover:text-blue-600 transition-colors duration-300">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors duration-300">
            How it Works
          </a>
          <a href="#resources" className="hover:text-blue-600 transition-colors duration-300">
            Resources
          </a>
          <button className="px-8 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
