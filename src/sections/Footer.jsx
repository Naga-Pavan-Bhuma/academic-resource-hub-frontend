// src/sections/Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-10 bg-gray-900 text-gray-200">
      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Logo / About */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-cyan-300">Academic Resource Hub</h2>
          <p className="text-sm text-gray-400">
            A centralized platform for resources, learning materials, and academic tools to empower students and faculty.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-cyan-300">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-cyan-400 transition">About Us</a></li>
            <li><a href="/resources" className="hover:text-cyan-400 transition">Resources</a></li>
            <li><a href="/announcements" className="hover:text-cyan-400 transition">Announcements</a></li>
            <li><a href="/contact" className="hover:text-cyan-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-cyan-300">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-cyan-400 transition">FAQ</a></li>
            <li><a href="/help" className="hover:text-cyan-400 transition">Help Center</a></li>
            <li><a href="/terms" className="hover:text-cyan-400 transition">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-cyan-300">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4 text-xl">
            <a href="#" className="hover:text-cyan-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-cyan-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-cyan-400 transition"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-cyan-400 transition"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 mt-10 pt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Academic Resource Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
