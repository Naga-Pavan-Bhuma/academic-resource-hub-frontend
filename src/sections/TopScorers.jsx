// src/components/TopScorers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const TopScorers = ({ user }) => {
  const [topUsers, setTopUsers] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leaderboard`);
        const sorted = res.data.sort((a, b) => b.points - a.points).slice(0, 3);
        setTopUsers(sorted);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, []);

const description = `💡 Upload PDFs → +10 points each! Climb the leaderboard, snag medals🥇🥈🥉, and show everyone who rules the campus! 🎉`;
  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Gold, Silver, Bronze

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>

      {/* Heading */}
      <motion.h2
        className="text-4xl md:text-5xl font-fredoka text-center mb-6 text-cyan-500"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🏅 Campus Leaderboard
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto font-poppins"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {description}
      </motion.p>

      {/* Top 3 Cards */}
      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6">
        {topUsers.map((u, index) => {
          const isCurrentUser =
            user && (u._id === user._id || u.collegeId === user.collegeId);

          return (
            <motion.div
              key={u._id}
              className="relative p-8 rounded-3xl shadow-2xl cursor-pointer overflow-hidden group"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
            >
              {/* Gradient animated background */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20 blur-3xl scale-110 transition-all duration-500 group-hover:opacity-40 group-hover:scale-125 rounded-3xl`}
              ></div>

              <motion.div
                className="relative z-10 flex flex-col items-center text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Medal */}
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-full text-3xl font-bold text-white mb-4"
                  style={{ backgroundColor: medalColors[index] }}
                >
                  {index + 1}
                </div>

                {/* Name */}
                <h3
                  className={`text-xl sm:text-2xl font-fredoka font-bold mb-1 truncate ${
                    isCurrentUser ? "text-cyan-600" : "text-gray-900"
                  }`}
                >
                  {u.name} {isCurrentUser && "⭐"}
                </h3>

                {/* ID */}
                <p className="text-sm sm:text-base font-poppins text-gray-600 mb-2">
                  ID: {u.collegeId || u._id}
                </p>

                {/* Points */}
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold text-sm sm:text-base ${
                    isCurrentUser ? "bg-cyan-600" : "bg-cyan-500"
                  }`}
                >
                  {u.points} pts
                </span>

                {/* Confetti for top 1 */}
                {index === 0 &&
                  [...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-yellow-400"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, 50, 0],
                        x: [0, 20, -20, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + Math.random(),
                      }}
                    />
                  ))}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopScorers;
