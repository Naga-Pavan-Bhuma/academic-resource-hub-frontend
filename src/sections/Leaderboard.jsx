import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = ({ user }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leaderboard`);
        setLeaderboardData(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <section className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 sm:p-6 hover:scale-105 transition-transform duration-300 w-full max-w-md mx-auto">
      {/* Heading */}
      <h2 className="text-center font-fredoka font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-cyan-500">
        Leaderboard
      </h2>

      <ul className="space-y-2 sm:space-y-3">
        {leaderboardData.map((u, index) => {
          const rank = index + 1;
          const isCurrentUser =
            user && (u._id === user._id || u.collegeId === user.collegeId);

          return (
            <li
              key={u._id}
              className={`flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition shadow-sm 
                ${isCurrentUser ? "bg-cyan-100 border-2 border-cyan-400 font-bold" : "hover:bg-white/30"}
              `}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Rank number for top 10 and current user */}
                {(rank <= 10 || isCurrentUser) && (
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-white text-xs sm:text-sm font-bold 
                      ${
                        rank === 1
                          ? "bg-yellow-400"
                          : rank === 2
                          ? "bg-gray-400"
                          : rank === 3
                          ? "bg-amber-700"
                          : "bg-cyan-500"
                      }`}
                  >
                    {rank}
                  </span>
                )}
                <span
                  className={`font-medium truncate text-sm sm:text-base ${
                    isCurrentUser ? "text-cyan-600" : "text-gray-900"
                  }`}
                >
                  {u.name} {isCurrentUser && "⭐"}
                </span>
              </div>
              <span
                className={`font-semibold text-sm sm:text-base ${
                  isCurrentUser ? "text-cyan-600" : "text-cyan-500"
                }`}
              >
                {u.points} pts
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Leaderboard;
