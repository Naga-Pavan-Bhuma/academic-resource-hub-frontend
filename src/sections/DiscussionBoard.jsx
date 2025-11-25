import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import ThreadCreate from "./ThreadCreate";
import ThreadFilters from "./ThreadFilters";
import ThreadList from "./ThreadList";
import Thread from "./Thread";
import Skeleton from "./Skeleton";
import ConfirmPopup from "./ConfirmPopup";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function DiscussionBoard({ user, resourceId }) {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // 🔥 Fetch discussions
  useEffect(() => {
    let active = true;
    setLoading(true);

    const url = resourceId
      ? `${API_BASE}/discussions?resourceId=${resourceId}`
      : `${API_BASE}/discussions?type=general`;

    axios
      .get(url)
      .then((res) => {
        if (!active) return;
        setThreads(res.data || []);
        setFilteredThreads(res.data || []);
        setSelectedThread(null);
      })
      .catch((err) => {
        console.error("Failed to load discussions:", err);
        if (active) {
          setThreads([]);
          setFilteredThreads([]);
        }
      })
      .finally(() => active && setLoading(false));

    return () => (active = false);
  }, [resourceId]);

  // 🔥 Add Comment
  const addComment = async (threadId, commentText) => {
    if (!user?._id) {
      alert("Login required");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE}/discussions/${threadId}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updated = threads.map((t) =>
        t._id === res.data._id ? res.data : t
      );

      setThreads(updated);
      setFilteredThreads(updated);

      if (selectedThread?._id === res.data._id) {
        setSelectedThread(res.data);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment");
    }
  };

  // 🔥 Delete thread
  const deleteThread = async (threadId, askConfirm = false) => {
    if (askConfirm) {
      setConfirmDeleteId(threadId);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE}/discussions/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = threads.filter((t) => t._id !== threadId);
      setThreads(updated);
      setFilteredThreads(updated);

      if (selectedThread?._id === threadId) setSelectedThread(null);
    } catch (err) {
      console.error("Failed to delete thread:", err);
      alert("Failed to delete thread");
    }
  };

  // 🔥 If user not logged in
  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-neutral-600 font-medium bg-white/30 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg"
        >
          Please <span className="font-semibold">log in</span> to participate in
          discussions.
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
            notes, drop summaries, and collaborate with your batchmates.
          </p>
        </div>

        <SearchBar
          threads={threads}
          setFilteredThreads={setFilteredThreads}
          setSelectedThread={setSelectedThread}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Create Thread + Filters */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
        >
          <ThreadCreate
            user={user}
            resourceId={resourceId}
            threads={threads}
            setThreads={setThreads}
            setFilteredThreads={setFilteredThreads}
            setSelectedThread={setSelectedThread}
          />

          <ThreadFilters
            threads={threads}
            setFilteredThreads={setFilteredThreads}
            setSelectedThread={setSelectedThread}
          />
        </motion.aside>

        {/* MIDDLE: Thread List */}
        <ThreadList
          loading={loading}
          threads={filteredThreads}
          selectedThread={selectedThread}
          setSelectedThread={setSelectedThread}
          Skeleton={Skeleton}
          user={user}
          deleteThread={deleteThread}
          setThreads={setThreads} // 🔥 required for real-time updates
          setFilteredThreads={setFilteredThreads} // 🔥 required
        />

        {/* RIGHT: Selected Thread */}
        <motion.main
          className="md:col-span-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 shadow-lg h-[520px] overflow-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedThread ? (
            <Thread
              thread={selectedThread}
              user={user}
              onAddComment={addComment}

              // 🔥 THIS IS THE FIX
              setThread={setSelectedThread}
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
                Tip: Choose a thread or create one to start chatting!
              </p>
            </div>
          )}
        </motion.main>
      </div>

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        open={!!confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          const id = confirmDeleteId;
          setConfirmDeleteId(null);
          deleteThread(id);
        }}
      />
    </div>
  );
}
