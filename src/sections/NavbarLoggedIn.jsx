import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const NavbarLoggedIn = ({ userName, profileImg }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Resources", path: "/student/resources" },
    { name: "Discussions", path: "/student/discussions" },
    { name: "Leaderboard", path: "/student/leaderboard" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/30 border-b border-white/30 shadow-xl">
      <div className="relative max-w-7xl mx-auto flex justify-between items-center px-6 py-3 md:py-4">
        {/* Logo */}
        <h1
          className="text-xl md:text-2xl font-extrabold text-gray-900 cursor-pointer"
          onClick={() => navigate("/student/resources")}
        >
          Academic Hub
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center font-medium text-gray-900 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-1 py-1 transition-all duration-300 transform hover:scale-105 ${
                location.pathname === item.path
                  ? "text-cyan-700 font-semibold after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-gradient-to-r after:from-cyan-400 after:via-blue-400 after:to-indigo-500 after:blur-sm after:opacity-70"
                  : "hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={profileImg || "https://via.placeholder.com/32"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-900 text-gray-900 font-medium rounded-md hover:bg-white/20 transform hover:scale-110 transition-all duration-300"
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
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`relative transition-all duration-300 hover:scale-105 ${
                location.pathname === item.path
                  ? "text-cyan-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-gradient-to-r after:from-cyan-400 after:via-blue-400 after:to-indigo-500 after:blur-sm after:opacity-70"
                  : "hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
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
            className="px-6 py-2 border border-gray-900 text-gray-900 rounded-md hover:bg-white/20 transform hover:scale-105 mt-2 transition-all duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavbarLoggedIn;
