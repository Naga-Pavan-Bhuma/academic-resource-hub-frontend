// src/sections/Hero.jsx
import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col items-center text-center py-20 px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
        Learn Smarter, Not Harder 🎓
      </h2>
      <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-700">
        Academic Resource Hub is a community-driven platform where seniors share 
        previous year papers, lab manuals, and project reports — so juniors can 
        prepare better and faster.
      </p>
      <button className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        Explore Resources
      </button>
    </section>
  );
};

export default Hero;
