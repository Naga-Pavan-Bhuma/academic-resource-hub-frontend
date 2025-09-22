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
    <section className="py-20 bg-gradient-to-r from-indigo-50 via-white to-pink-50">
      <motion.h3
        className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800"
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
            <h4 className="font-semibold text-2xl mb-3 text-gray-800">{step.title}</h4>
            <p className="text-gray-500 text-base">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
