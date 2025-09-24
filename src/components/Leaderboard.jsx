import React from "react";

const leaderboardData = [
  { name: "Tejaswi", points: 120 },
  { name: "Arjun", points: 95 },
  { name: "Meena", points: 80 },
  { name: "Rahul", points: 70 },
  { name: "Sneha", points: 65 },
  { name: "Kiran", points: 60 },
  { name: "Anita", points: 55 },
];

const Leaderboard = () => {
  return (
    <aside className="w-72 bg-white p-4 hidden lg:block overflow-y-auto max-h-screen rounded-md shadow">
      {/* Heading */}
      <h2 className="text-center font-bold text-lg mb-4 text-cyan-700 flex justify-center items-center gap-2">
        🏆 Leaderboard
      </h2>

      <ul className="space-y-2">
        {leaderboardData.map((user, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-3 py-2 rounded hover:bg-cyan-50 transition"
          >
            <div className="flex items-center gap-3">
              {/* Rank badge for top 3 */}
              {index < 3 && (
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-white font-bold ${
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
              <span className="font-medium text-gray-800 truncate">{user.name}</span>
            </div>
            <span className="font-semibold text-cyan-700">{user.points} pts</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Leaderboard;
