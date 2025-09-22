// src/sections/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 bg-gray-900 text-gray-400 text-center text-sm">
      © {new Date().getFullYear()} Academic Resource Hub. All rights reserved.
    </footer>
  );
};

export default Footer;
