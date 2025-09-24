// src/sections/CallToAction.jsx
import React from "react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="relative py-24 bg-white text-gray-900 overflow-hidden">
      {/* Subtle gradient blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
      {/* Changed yellow blob to cyan */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        {/* Heading */}
        <motion.h2
  className="text-4xl md:text-5xl font-fredoka font-extrabold mb-6 leading-tight"
  initial={{ opacity: 0, y: -40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Unlock Smarter Learning with<br />
  <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">
    Peer-Powered Resources
  </span>
</motion.h2>


        {/* Subtext */}
        <motion.p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-700"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Access verified notes, past papers, and project resources shared by
          seniors. Study smarter, collaborate faster, and stay ahead of the curve.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-5"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#"
            className="px-8 py-4 bg-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-300/50 hover:scale-105 transition-transform duration-300"
          >
            🚀 Join Now
          </a>
          <a
            href="#"
            className="px-8 py-4 border-2 border-gray-300 text-gray-900 font-semibold rounded-xl hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            📂 Explore Resources
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
