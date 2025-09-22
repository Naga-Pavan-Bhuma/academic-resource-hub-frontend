// src/sections/Hero.jsx
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Hero = () => {
  // Particle engine init
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  // Hero title text for staggered letter animation
  const title = "Learn Smarter, Not Harder";
  const letters = Array.from(title);

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center text-center">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#ffffff" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 150, duration: 0.6 },
              push: { quantity: 4 },
            },
          },
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { value: ["#06b6d4", "#22d3ee", "#67e8f9"] },
            shape: { type: ["circle", "triangle", "star"] },
            opacity: {
              value: 0.6,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false },
            },
            size: {
              value: { min: 2, max: 6 },
              random: true,
              anim: { enable: true, speed: 3, size_min: 1, sync: false },
            },
            links: {
              enable: true,
              distance: 130,
              color: "#06b6d4",
              opacity: 0.25,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1.2,
              random: true,
              direction: "none",
              straight: false,
              outModes: { default: "out" },
              attract: { enable: true, rotateX: 600, rotateY: 1200 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Hero Glass Card */}
      <motion.div
        className="relative z-10 p-10 md:p-14 rounded-3xl bg-white/20 backdrop-blur-2xl shadow-2xl max-w-4xl mx-6 hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {/* Staggered letter animation for the title */}
        <h1 className="flex justify-center flex-wrap mb-6 text-gray-900 text-5xl md:text-6xl lg:text-6xl font-fredoka tracking-wide leading-tight">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Academic Resource Hub is a community-driven platform where seniors share
          previous year papers, lab manuals, and project reports — so juniors can
          prepare better and faster.
        </motion.p>

        <motion.button
          className="px-10 py-4 bg-cyan-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 hover:bg-cyan-600 transition-transform duration-300"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Explore Resources
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
