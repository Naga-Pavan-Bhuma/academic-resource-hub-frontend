import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard"); 
        setLeaderboardData(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <section className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 hover:scale-105 transition-transform duration-300">
      {/* Heading */}
      <h2 className="text-center font-fredoka font-bold text-2xl mb-6 text-cyan-500 flex justify-center items-center gap-2">
        Leaderboard
      </h2>

      <ul className="space-y-3">
        {leaderboardData.map((user, index) => (
          <li
            key={user._id}
            className="flex justify-between items-center px-4 py-2 rounded-2xl hover:bg-white/30 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              {/* Rank badge for top 3 */}
              {index < 3 && (
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-white font-bold ${
                    index === 0
                      ? "bg-yellow-400"
                      : index === 1
                      ? "bg-gray-400"
                      : "bg-amber-700"
                  }`}
                >
                  {index + 1}
                </span>
              )}
              <span className="font-medium text-gray-900 truncate">{user.name}</span>
            </div>
            <span className="font-semibold text-cyan-500">{user.points} pts</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Leaderboard;
