// src/sections/CallToAction.jsx
import React from "react";

const CallToAction = () => {
  return (
    <section className="py-20 text-center bg-blue-600 text-white">
      <h3 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to Join the Community?
      </h3>
      <p className="mb-6 text-lg">Start exploring or upload your own resources today!</p>
      <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100">
        Get Started
      </button>
    </section>
  );
};

export default CallToAction;
