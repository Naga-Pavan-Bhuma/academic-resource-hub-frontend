import React, { useState, useEffect } from "react";
import "@fontsource/poppins";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shine, setShine] = useState(-50);

  // Logo shimmer animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShine((prev) => (prev >= 150 ? -50 : prev + 1));
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/30 border-b border-white/30 shadow-xl">
        <div className="relative max-w-7xl mx-auto flex justify-between items-center px-6 py-3 md:py-4">
          {/* Logo */}
          <div className="relative overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500 w-fit">
            <img
              src="/assets/Logo1.gif"
              alt="Academic Hub Logo"
              className="h-8 md:h-9 lg:h-10 object-contain"
              style={{ width: "auto" }}
            />
            <span
              className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white/60 via-white/20 to-white/0 transform skew-x-12 pointer-events-none"
              style={{ left: `${shine}%`, transition: "left 0.015s linear" }}
            />
          </div>

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

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            <Link to="/login">
              <button className="px-4 py-2 border border-gray-900 text-gray-900 font-medium rounded-md hover:bg-white/20 transform hover:scale-110 hover:shadow-lg transition-all duration-400">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:shadow-xl hover:bg-blue-700 transform hover:scale-110 hover:translate-y-1 animate-pulse transition-all duration-400">
                Sign Up
              </button>
            </Link>
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
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 z-50 mx-2 rounded-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg transform transition-all duration-500 ease-in-out ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center py-6 gap-5 font-poppins font-medium text-gray-900 text-base">
          {["Features", "How it Works", "Resources"].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
              style={{
                transitionDelay: `${i * 0.08}s`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {item}
            </a>
          ))}

          {/* Mobile buttons */}
          <div className="flex flex-col gap-4 mt-4 w-4/5">
            <Link to="/login">
              <button className="w-full px-6 py-2 border border-gray-900 text-gray-900 rounded-md hover:bg-white/20 transform hover:scale-105 hover:shadow-md transition-all duration-400">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:shadow-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-400">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
