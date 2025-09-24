import React, { useState } from "react";
import { FaUserCircle, FaBook, FaUpload, FaComments, FaTrophy } from "react-icons/fa";
import StatsSection from "../components/StatsSection";
import ResourceSearch from "../components/ResourceSearch";
import DiscussionBoard from "../components/DiscussionBoard";
import Leaderboard from "../components/Leaderboard";

const StudentDashboard = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const user = {
    name: "Tejaswi",
    role: "Student",
    isContributor: true,
    stats: {
      downloads: 12,
      doubts: 3,
      contributions: 2,
    },
  };

  const handleLeaderboardToggle = () => setShowLeaderboard(prev => !prev);

  return (
    <div className="min-h-screen flex bg-gray-100 w-full overflow-x-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-cyan-700 to-cyan-900 text-gray-100 flex flex-col fixed h-full">
        <div className="px-6 py-5 text-xl font-bold text-white tracking-wide border-b border-cyan-600">
          Dashboard
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3 text-sm">
          <a href="#stats" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800 transition">
            <FaBook /> Stats
          </a>
          <a href="#resources" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800 transition">
            <FaComments /> Resources
          </a>
          <a href="#discussions" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800 transition">
            <FaUpload /> Discussions
          </a>
          <button
            onClick={handleLeaderboardToggle}
            className="flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg hover:bg-cyan-800 transition"
          >
            <FaTrophy /> Leaderboard
          </button>
        </nav>
        <div className="p-4 border-t border-cyan-800 text-xs text-gray-300">
          © {new Date().getFullYear()} Academic Resource Hub
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 ml-64 transition-all duration-300 ${
          showLeaderboard ? "max-w-[calc(100%-64px-18rem)]" : "max-w-[calc(100%-64px)]"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.name}{" "}
            {user.isContributor && (
              <span className="ml-2 px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded-full">
                Contributor
              </span>
            )}
          </h1>
          <FaUserCircle className="text-4xl text-cyan-700" />
        </div>

        {/* Sections with IDs */}
        <section id="stats">
          <StatsSection stats={user.stats} />
        </section>

        <section id="resources">
          <ResourceSearch />
        </section>

        <section id="discussions">
          <DiscussionBoard />
        </section>
      </main>

      {/* Leaderboard Sidebar (scrollable independently) */}
      {showLeaderboard && (
        <aside className="w-72 flex-shrink-0 bg-white p-6 border-l h-screen overflow-y-auto fixed right-0 top-0">
          <Leaderboard />
        </aside>
      )}
    </div>
  );
};

export default StudentDashboard;
