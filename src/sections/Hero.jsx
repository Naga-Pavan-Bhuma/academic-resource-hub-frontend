// src/sections/Hero.jsx
import React, { useCallback, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Hero = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const heroRef = useRef(null);
  const [heroHeight, setHeroHeight] = useState(window.innerHeight);

  useEffect(() => {
    if (heroRef.current) setHeroHeight(heroRef.current.clientHeight);

    const handleResize = () => {
      if (heroRef.current) setHeroHeight(heroRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const title = "Learn Smarter, Not Harder";
  const letters = Array.from(title);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center bg-white"
    >
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: heroHeight }}
        options={{
          fullScreen: { enable: false },
          background: { color: "#ffffff" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: { repulse: { distance: 180, duration: 0.6 }, push: { quantity: 4 } },
          },
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { 
              value: ["#06b6d4","#22d3ee","#67e8f9","#f472b6","#c084fc","#facc15","#10b981","#f87171","#3b82f6","#8b5cf6"], 
              animation: { enable: true, speed: 20, sync: false } 
            },
            shape: { type: ["circle","triangle","star"] },
            opacity: { value: 0.6, random: { enable: true, minimumValue: 0.3 }, anim: { enable: true, speed: 1.2, opacity_min: 0.2, sync: false } },
            size: { value: { min: 2, max: 6 }, random: true, anim: { enable: true, speed: 2.5, size_min: 1, sync: false } },
            links: { enable: true, distance: 100, color: "#06b6d4", opacity: 0.3, width: 1.5 },
            move: { enable: true, speed: 1, random: true, direction: "none", straight: false, outModes: { default: "out" }, attract: { enable: true, rotateX: 600, rotateY: 1200 } },
          },
          detectRetina: true,
        }}
      />

      {/* Gradient blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>

      {/* Floating shapes */}
      <div className="absolute top-10 left-1/4 w-12 h-12 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float1 z-0"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float2 z-0"></div>
      <div className="absolute bottom-20 left-1/3 w-10 h-10 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float3 z-0"></div>

      {/* Hero Glass Card */}
      <motion.div
        className="relative z-10 p-10 md:p-14 rounded-3xl bg-white/20 backdrop-blur-2xl shadow-2xl max-w-4xl mx-6 hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <h1 className="flex justify-center flex-wrap mb-6 text-gray-900 text-5xl md:text-6xl lg:text-6xl font-fredoka tracking-wide leading-tight">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              {char === " " ? "\u00A0" : char}
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
  className="relative px-10 py-4 bg-cyan-500/80 text-white rounded-2xl font-semibold shadow-lg overflow-hidden hover:scale-105 hover:shadow-cyan-400/50 transition-transform duration-300"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.7, delay: 0.6 }}
>
  {/* Full button subtle gloss effect */}
  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/40 via-white/10 to-white/40 opacity-0 hover:opacity-30 transition-opacity duration-500 pointer-events-none animate-shine"></span>

  <span className="relative z-10">Explore Resources</span>

  <style>
    {`
      @keyframes shine {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .animate-shine {
        background-size: 200% 100%;
        animation: shine 2.5s linear infinite;
      }
    `}
  </style>
</motion.button>

      </motion.div>

      {/* Floating animations */}
      <style>
        {`
          @keyframes float1 {
            0% { transform: translate(0,0) rotate(0deg) scale(1); }
            25% { transform: translate(10px,-10px) rotate(15deg) scale(1.05); }
            50% { transform: translate(-10px,10px) rotate(-10deg) scale(0.95); }
            75% { transform: translate(5px,-5px) rotate(5deg) scale(1.02); }
            100% { transform: translate(0,0) rotate(0deg) scale(1); }
          }
          @keyframes float2 {
            0% { transform: translate(0,0) rotate(0deg) scale(1); }
            25% { transform: translate(-8px,8px) rotate(-12deg) scale(0.97); }
            50% { transform: translate(12px,-12px) rotate(10deg) scale(1.03); }
            75% { transform: translate(-6px,6px) rotate(-5deg) scale(0.98); }
            100% { transform: translate(0,0) rotate(0deg) scale(1); }
          }
          @keyframes float3 {
            0% { transform: translate(0,0) rotate(0deg) scale(1); }
            25% { transform: translate(5px,5px) rotate(10deg) scale(1.04); }
            50% { transform: translate(-5px,-5px) rotate(-8deg) scale(0.96); }
            75% { transform: translate(3px,3px) rotate(4deg) scale(1.02); }
            100% { transform: translate(0,0) rotate(0deg) scale(1); }
          }
          .animate-float1 { animation: float1 6s ease-in-out infinite; }
          .animate-float2 { animation: float2 8s ease-in-out infinite; }
          .animate-float3 { animation: float3 5s ease-in-out infinite; }
        `}
      </style>
    </section>
  );
};

export default Hero;
