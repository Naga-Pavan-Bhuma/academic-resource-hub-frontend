// src/sections/WhyChooseUs.jsx
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "📄",
    title: "Verified Resources",
    desc: "Get authentic exam papers, lab manuals, and reports directly from seniors.",
    color: "from-indigo-400 to-purple-500",
  },
  {
    icon: "🔍",
    title: "Easy Search",
    desc: "Find resources by subject, year, or keywords in just seconds.",
    color: "from-green-400 to-teal-500",
  },
  {
    icon: "🤝",
    title: "Peer Support",
    desc: "Discuss doubts with peers through subject-based threads.",
    color: "from-pink-400 to-red-500",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <motion.h3
        className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Why Choose Us?
      </motion.h3>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="relative p-8 rounded-3xl shadow-2xl cursor-pointer overflow-hidden group"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
          >
            {/* Gradient animated background */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${feature.color} opacity-20 blur-3xl scale-110 transition-all duration-500 group-hover:opacity-40 group-hover:scale-125 rounded-3xl`}
            ></div>

            <motion.div
              className="relative z-10 flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-6xl mb-6">{feature.icon}</div>
              <h4 className="text-2xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h4>
              <p className="text-gray-700">{feature.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
