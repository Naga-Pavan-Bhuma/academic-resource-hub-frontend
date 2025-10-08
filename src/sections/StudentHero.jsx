import React, { useEffect, useRef, useState, useCallback } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { motion } from "framer-motion";

const StudentHero = ({ user }) => {
  const heroRef = useRef(null);
  const [heroHeight, setHeroHeight] = useState(window.innerHeight);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    if (heroRef.current) setHeroHeight(heroRef.current.clientHeight);
    const handleResize = () => {
      if (heroRef.current) setHeroHeight(heroRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split text into parts
  const titleStart = "Welcome Back, ";
  const userName = `${user?.name || "Student"}!`;
  const exclamation = " 👋";
  const lettersStart = Array.from(titleStart);
  const lettersName = Array.from(userName);
  const lettersEnd = Array.from(exclamation);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex items-center justify-center text-center bg-white overflow-hidden"
    >
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: heroHeight,
        }}
        options={{
          fullScreen: { enable: false },
          background: { color: "#ffffff" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 180, duration: 0.6 },
              push: { quantity: 4 },
            },
          },
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: {
              value: [
                "#06b6d4",
                "#22d3ee",
                "#67e8f9",
                "#f472b6",
                "#c084fc",
                "#facc15",
                "#10b981",
                "#f87171",
                "#3b82f6",
                "#8b5cf6",
              ],
            },
            shape: { type: ["circle", "triangle", "star"] },
            opacity: {
              value: 0.6,
              random: { enable: true, minimumValue: 0.3 },
              anim: { enable: true, speed: 1.2 },
            },
            size: {
              value: { min: 2, max: 6 },
              random: true,
              anim: { enable: true, speed: 2.5 },
            },
            links: {
              enable: true,
              distance: 100,
              color: "#06b6d4",
              opacity: 0.3,
              width: 1.5,
            },
            move: {
              enable: true,
              speed: 1,
              random: true,
              outModes: { default: "out" },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Gradient Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Floating Shapes */}
      <div className="absolute top-10 left-1/4 w-12 h-12 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float1"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float2"></div>
      <div className="absolute bottom-20 left-1/3 w-10 h-10 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float3"></div>

      {/* Glass Welcome Card */}
      <motion.div
        className="relative z-10 p-10 md:p-16 rounded-3xl bg-white/30 backdrop-blur-2xl shadow-2xl hover:scale-105 transition-transform duration-300 max-w-3xl mx-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {/* Line 1 — Welcome Back */}
        <h1 className="flex justify-center flex-wrap text-gray-900 text-4xl md:text-5xl font-fredoka tracking-wide leading-tight">
          {lettersStart.map((char, index) => (
            <motion.span
              key={`start-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        {/* Line 2 — Username in cyan */}
        <h1 className="flex justify-center mb-2 flex-wrap text-cyan-500 text-4xl md:text-5xl font-fredoka font-bold tracking-wide leading-tight">
          {lettersName.map((char, index) => (
            <motion.span
              key={`name-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: (lettersStart.length + index) * 0.05,
                duration: 0.5,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          {/* Emoji */}
          {lettersEnd.map((char, index) => (
            <motion.span
              key={`end-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay:
                  (lettersStart.length + lettersName.length + index) * 0.05,
                duration: 0.5,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-poppins"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Ready to level up your academics? Access shared notes, previous year
          papers, and projects from your peers — all in one smart hub built to
          make learning faster and easier.
        </motion.p>

        <motion.button
          className="relative px-10 py-4 bg-cyan-500/80 text-white rounded-2xl font-poppins font-semibold shadow-lg overflow-hidden hover:scale-105 hover:shadow-cyan-400/50 transition-transform duration-300"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/40 via-white/10 to-white/40 opacity-0 hover:opacity-30 transition-opacity duration-500 pointer-events-none animate-shine"></span>
          <span className="relative z-10">Scroll for More!!!</span>
        </motion.button>
      </motion.div>

      {/* Floating Animations */}
      <style>
        {`
          @keyframes float1 { 0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-10px)}50%{transform:translate(-10px,10px)}75%{transform:translate(5px,-5px)} }
          @keyframes float2 { 0%,100%{transform:translate(0,0)}25%{transform:translate(-8px,8px)}50%{transform:translate(12px,-12px)}75%{transform:translate(-6px,6px)} }
          @keyframes float3 { 0%,100%{transform:translate(0,0)}25%{transform:translate(5px,5px)}50%{transform:translate(-5px,-5px)}75%{transform:translate(3px,3px)} }
          .animate-float1 { animation: float1 6s ease-in-out infinite; }
          .animate-float2 { animation: float2 8s ease-in-out infinite; }
          .animate-float3 { animation: float3 5s ease-in-out infinite; }
        `}
      </style>
    </section>
  );
};

export default StudentHero;
