// src/components/NavbarLoggedIn.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarLoggedIn = ({ userName, profileImg }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shine, setShine] = useState(-50);
  const navigate = useNavigate();

  // Logo shimmer animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShine((prev) => (prev >= 150 ? -50 : prev + 1));
    }, 15);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/30 border-b border-white/30 shadow-xl overflow-hidden">
      {/* Gradient shine */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: `linear-gradient(120deg, rgba(255,255,255,0.1) ${shine}%, rgba(255,255,255,0.25) ${shine + 15}%, rgba(255,255,255,0.1) ${shine + 30}%)`,
          transition: "background 0.015s linear",
        }}
      />

      <div className="relative max-w-7xl mx-auto flex justify-between items-center px-6 py-3 md:py-4">
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 relative overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500">
          Academic Hub
          <span
            className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white/60 via-white/20 to-white/0 transform skew-x-12 pointer-events-none"
            style={{ left: `${shine}%`, transition: "left 0.015s linear" }}
          />
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center font-medium text-gray-900 text-sm">
          {["Features", "How it Works", "Resources"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="relative group px-1 py-1 transition-all duration-500 hover:text-blue-600 transform hover:scale-110"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 rounded transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={profileImg || "https://via.placeholder.com/32"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{userName}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-900 text-gray-900 font-medium rounded-md hover:bg-white/20 transform hover:scale-110 hover:shadow-lg transition-all duration-400"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none relative w-8 h-7 flex flex-col justify-between items-center"
          >
            <span
              className={`block h-0.5 w-8 bg-gray-900 rounded transform transition-all duration-500 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-gray-900 rounded transition-all duration-500 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-gray-900 rounded transform transition-all duration-500 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden backdrop-blur-lg bg-white/30 border-t border-white/30 overflow-hidden transition-max-height duration-500 ${
          menuOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center py-4 gap-3 font-medium text-gray-900 text-sm">
          {["Features", "How it Works", "Resources"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="hover:text-blue-600 transition-all duration-500 hover:scale-105"
            >
              {item}
            </a>
          ))}

          {/* Mobile Profile */}
          <div className="flex items-center gap-2 mt-2">
            <img
              src={profileImg || "https://via.placeholder.com/32"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{userName}</span>
          </div>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-gray-900 text-gray-900 rounded-md hover:bg-white/20 transform hover:scale-110 hover:shadow-lg transition-all duration-400 mt-2"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavbarLoggedIn;
