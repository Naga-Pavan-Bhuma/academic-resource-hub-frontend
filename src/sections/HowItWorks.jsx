// src/sections/HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: "📤",
    title: "Upload",
    desc: "Seniors share resources with the community.",
  },
  {
    icon: "🔍",
    title: "Search",
    desc: "Juniors quickly find what they need.",
  },
  {
    icon: "📚",
    title: "Learn",
    desc: "Study smart with tried & tested resources.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Subtle gradient blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>

      <motion.h3
        className="text-4xl md:text-5xl font-fredoka text-center mb-16 text-gray-900"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        How It Works
      </motion.h3>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <motion.div
              className="text-6xl mb-6"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {step.icon}
            </motion.div>
            <h4 className="font-fredoka text-2xl mb-3 text-gray-900">{step.title}</h4>
            <p className="text-gray-500 text-base">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
