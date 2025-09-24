// src/sections/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="relative py-6 bg-gray-900/60 backdrop-blur-lg text-gray-200 text-center text-sm overflow-hidden">
      {/* Subtle animated glow behind the footer */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/10 to-purple-400/20 opacity-40 animate-glow pointer-events-none"></div>

      {/* Footer content */}
      <div className="relative z-10">
        © {new Date().getFullYear()} Academic Resource Hub. All rights reserved.
      </div>

      {/* Glow animation */}
      <style>
        {`
          @keyframes glow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-glow {
            background-size: 200% 200%;
            animation: glow 6s ease-in-out infinite;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
