// src/sections/HowItWorks.jsx
import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <h3 className="text-3xl font-bold text-center mb-10">How It Works</h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📤</div>
          <h4 className="font-semibold text-lg mb-2">Upload</h4>
          <p className="text-gray-600">Seniors share resources with the community.</p>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h4 className="font-semibold text-lg mb-2">Search</h4>
          <p className="text-gray-600">Juniors quickly find what they need.</p>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h4 className="font-semibold text-lg mb-2">Learn</h4>
          <p className="text-gray-600">Study smart with tried & tested resources.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
