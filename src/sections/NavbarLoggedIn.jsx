import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

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
    { name: "Upload", path: "/student/upload" },
    { name: "Leaderboard", path: "/student/leaderboard" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/20 border-b border-white/30 shadow-lg">
      <div className="relative max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
         <img
  src="/assets/Logo1.gif" // 👈 your logo path (like /academic-hub-logo.svg or .png)
  alt="Academic Hub Logo"
  onClick={() => navigate("/student/resources")}
  className="h-8 md:h-10 w-auto cursor-pointer transform hover:scale-105 transition-transform duration-300 object-contain"
/>



        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center font-medium text-gray-900 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-2 py-1 transition-transform duration-300 hover:-translate-y-1 hover:scale-105 ${
                location.pathname === item.path
                  ? "text-cyan-500 font-semibold after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-gradient-to-r after:from-cyan-400 after:via-blue-400 after:to-indigo-500 after:blur-sm after:opacity-80"
                  : "text-gray-700 hover:text-cyan-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer group">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 text-cyan-400" />
            )}
            <span className="font-medium text-gray-900 group-hover:text-cyan-500 transition-colors duration-300">
              {userName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 border border-cyan-400 text-cyan-500 font-medium rounded-lg hover:bg-cyan-500 hover:text-white transform hover:scale-110 transition-all duration-300"
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
              className={`block h-0.5 w-8 bg-cyan-500 rounded transform transition-all duration-500 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-cyan-500 rounded transition-all duration-500 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-8 bg-cyan-500 rounded transform transition-all duration-500 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden backdrop-blur-xl bg-white/20 border-t border-white/30 overflow-hidden transition-max-height duration-500 ${
          menuOpen ? "max-h-72" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center py-4 gap-4 font-medium text-gray-900 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`relative px-3 py-1 transition-transform duration-300 hover:-translate-y-1 hover:scale-105 ${
                location.pathname === item.path
                  ? "text-cyan-500 font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-gradient-to-r after:from-cyan-400 after:via-blue-400 after:to-indigo-500 after:blur-sm after:opacity-80"
                  : "text-gray-700 hover:text-cyan-400"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Profile */}
          <div className="flex items-center gap-2 mt-3">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 text-cyan-400" />
            )}
            <span className="font-medium text-gray-900">{userName}</span>
          </div>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-cyan-400 text-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-white transform hover:scale-105 mt-3 transition-all duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavbarLoggedIn;
