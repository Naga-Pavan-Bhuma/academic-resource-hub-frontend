// src/sections/WhyChooseUs.jsx
import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <h3 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md">
          <h4 className="text-xl font-semibold mb-2">📄 Verified Resources</h4>
          <p className="text-gray-600">
            Get authentic exam papers, lab manuals, and reports directly from seniors.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md">
          <h4 className="text-xl font-semibold mb-2">🔍 Easy Search</h4>
          <p className="text-gray-600">
            Find resources by subject, year, or keywords in just seconds.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md">
          <h4 className="text-xl font-semibold mb-2">🤝 Peer Support</h4>
          <p className="text-gray-600">
            Discuss doubts with peers through subject-based threads.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
