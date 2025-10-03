import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API || "http://localhost:5000/api";

export default function ThreadCreate({ threads, setThreads, setFilteredThreads, setSelectedThread, user, resourceId }) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const createThread = async () => {
    if (!user?._id) {
      alert("Login required");
      return;
    }
    if (!title.trim()) return;

    setCreating(true);
    try {
      const res = await axios.post(`${API_BASE}/discussions`, {
        title: title.trim(),
        createdBy: user._id,
        resourceId: resourceId || null,
      });
      const newThreads = [res.data, ...threads];
      setThreads(newThreads);
      setFilteredThreads(newThreads);
      setTitle("");
      setSelectedThread(res.data);
    } catch (error) {
      console.error("Create thread error", error);
      alert("Failed to create thread. Try again later.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Start a new thread
      </label>
      <div className="flex gap-3">
        <input
          id="new-thread-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createThread()}
          placeholder="Give it a clear, helpful title"
          className="
            flex-1
            rounded-xl
            border border-white/30
            bg-white/20
            backdrop-blur-md
            px-4 py-3
            text-sm text-slate-900
            placeholder-slate-400
            shadow-md
            focus:outline-none focus:ring-2 focus:ring-cyan-300
            transition-all duration-300
            hover:shadow-lg
          "
        />
        <button
          onClick={createThread}
          disabled={creating}
          className="
            inline-flex items-center justify-center px-5 py-2
            bg-gradient-to-tr from-cyan-500 to-blue-500
            text-white font-semibold text-sm
            rounded-xl shadow-lg
            hover:scale-105 hover:brightness-110
            active:scale-95 active:brightness-90
            transition transform
            disabled:opacity-60
          "
          title="Create Thread"
        >
          {creating ? "Creating..." : "Post"}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Tip: Use short descriptive titles so classmates can find your thread easily.
      </p>
    </div>
  );
}
