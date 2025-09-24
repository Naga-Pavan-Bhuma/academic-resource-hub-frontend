import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBook, FaUpload, FaComments, FaTrophy } from "react-icons/fa";
import ResourceSearch from "../sections/ResourceSearch";
import DiscussionBoard from "../sections/DiscussionBoard";
import Leaderboard from "../sections/Leaderboard";
import NavbarLoggedIn from "../sections/NavbarLoggedIn";

const StudentDashboard = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 w-full overflow-x-hidden">
      {/* Navbar */}
      <NavbarLoggedIn userName={user.name} profileImg={user.profileImg} />

      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-cyan-700 to-cyan-900 text-gray-100 flex flex-col fixed h-full top-16">
          <div className="px-6 py-5 text-xl font-bold text-white tracking-wide border-b border-cyan-600">
            Dashboard
          </div>
          <nav className="flex-1 px-4 py-6 space-y-3 text-sm">
            <a
              href="#resources"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800 transition"
            >
              <FaComments /> Resources
            </a>
            <a
              href="#discussions"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800 transition"
            >
              <FaUpload /> Discussions
            </a>
            <button
              onClick={() => setShowLeaderboard((prev) => !prev)}
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
          <section id="resources">
            <ResourceSearch />
          </section>

          <section id="discussions">
            <DiscussionBoard />
          </section>
        </main>

        {/* Leaderboard */}
        {showLeaderboard && (
          <aside className="w-72 flex-shrink-0 bg-white p-6 border-l h-screen overflow-y-auto fixed right-0 top-16">
            <Leaderboard />
          </aside>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
