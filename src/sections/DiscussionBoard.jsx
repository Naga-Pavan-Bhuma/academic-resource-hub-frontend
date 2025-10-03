import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import ThreadCreate from "./ThreadCreate";
import ThreadFilters from "./ThreadFilters";
import ThreadList from "./ThreadList";
import Thread from "./Thread";
import Skeleton from "./Skeleton";

const API_BASE = import.meta.env.VITE_API || "http://localhost:5000/api";

export default function DiscussionBoard({ user, resourceId }) {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch discussions
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchUrl = () =>
      `${API_BASE}/discussions${
        resourceId ? `?resourceId=${resourceId}` : "?type=general"
      }`;

    axios
      .get(fetchUrl())
      .then((res) => {
        if (!mounted) return;
        setThreads(res.data || []);
        setFilteredThreads(res.data || []);
        setSelectedThread(null);
      })
      .catch((err) => {
        console.error("Failed to load discussions:", err);
        if (mounted) {
          setThreads([]);
          setFilteredThreads([]);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [resourceId]);

  // Add comment
  const addComment = async (threadId, commentText) => {
    if (!user?._id) {
      alert("Login required");
      return;
    }
    if (!commentText) return;

    try {
      const res = await axios.post(
        `${API_BASE}/discussions/${threadId}/comments`,
        {
          text: commentText,
          postedBy: user._id,
        }
      );
      const updatedThreads = threads.map((t) =>
        t._id === res.data._id ? res.data : t
      );
      setThreads(updatedThreads);
      setFilteredThreads(updatedThreads);
      if (selectedThread?._id === res.data._id) setSelectedThread(res.data);
    } catch (error) {
      console.error("Post comment failed", error);
      alert("Failed to post comment.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-neutral-600 font-medium bg-white/30 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg"
        >
          Please <span className="font-semibold">log in</span> to view and
          participate in discussions.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-gradient-to-tr from-pink-50 via-white to-cyan-50 rounded-3xl shadow-xl">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
            {resourceId ? "Course Discussion" : "Campus Forum"}
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-500 max-w-lg">
            A friendly and interactive space for students — ask questions, share
            ideas, summarize lessons, and collaborate effectively.
          </p>
        </div>
        <SearchBar
          threads={threads}
          setFilteredThreads={setFilteredThreads}
          setSelectedThread={setSelectedThread}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Create thread + Filters */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="md:col-span-1 p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
        >
          {/* Thread Creation */}
          <ThreadCreate
            threads={threads}
            setThreads={setThreads}
            setFilteredThreads={setFilteredThreads}
            setSelectedThread={setSelectedThread}
            user={user}
            resourceId={resourceId}
          />

          {/* Quick Filters */}
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Quick filters
            </h3>
            <div className="flex gap-2 flex-wrap">
              {["All", "Recent", "Active"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    if (filter === "All") {
                      setFilteredThreads(threads);
                      setSelectedThread(null);
                    } else if (filter === "Recent") {
                      const recent = [...threads].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      );
                      setFilteredThreads(recent);
                      setSelectedThread(null);
                    } else {
                      const active = threads.filter(
                        (t) => (t.comments || []).length > 0
                      );
                      setFilteredThreads(active);
                      setSelectedThread(null);
                    }
                  }}
                  className="px-3 py-1 rounded-full border border-white/40 text-sm text-slate-700 bg-white/20 backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-400 hover:text-white shadow-sm hover:shadow-lg transition transform hover:scale-105"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard Tips */}
          <div className="mt-3 text-xs text-slate-400">
            <strong>Keyboard tips:</strong>
            <ul className="mt-1 list-disc list-inside">
              <li>Enter to submit thread or search</li>
              <li>Arrow keys to navigate within thread list</li>
            </ul>
          </div>
        </motion.aside>

        {/* Middle column: Thread list */}
        <ThreadList
          loading={loading}
          threads={filteredThreads}
          selectedThread={selectedThread}
          setSelectedThread={setSelectedThread}
          Skeleton={Skeleton}
          className="md:col-span-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-4 h-[520px] overflow-hidden"
        />

        {/* Right column: Selected thread */}
        <motion.main
          className="md:col-span-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 shadow-lg h-[520px] overflow-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          {selectedThread ? (
            <Thread
              thread={selectedThread}
              user={user}
              onAddComment={addComment}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 1.657-1.343 3-3 3H6l-3 3V6a2 2 0 012-2h14c1.657 0 3 1.343 3 3z"
                />
              </svg>
              <div className="text-lg font-semibold">
                Select a thread to view conversation
              </div>
              <p className="mt-2 text-sm">
                Pro tip: Click a thread on the left or create a new one to start
                a chat.
              </p>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
