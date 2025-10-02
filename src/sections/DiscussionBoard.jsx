import React, { useEffect, useState } from "react";
import axios from "axios";
import Thread from "./Thread";

const API_BASE = import.meta.env.VITE_API || "http://localhost:5000/api";

function DiscussionBoard({ user, resourceId }) {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = `${API_BASE}/discussions`;
    if (resourceId) url += `?resourceId=${resourceId}`;
    else url += `?type=general`;

    axios.get(url)
      .then((res) => {
        setThreads(res.data);
        setFilteredThreads(res.data);
        setSelectedThread(null);
      })
      .finally(() => setLoading(false));
  }, [resourceId]);

  const handleSearch = () => {
    const filtered = threads.filter(thread =>
      thread.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    setFilteredThreads(filtered);
    setSelectedThread(null);
  };

  const createThread = async () => {
    if (!user?._id) {
      alert("Login required");
      return;
    }
    if (!title.trim()) return;

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
      alert("Failed to create thread.");
    }
  };

  const addComment = async (threadId, commentText) => {
    if (!user?._id) {
      alert("Login required");
      return;
    }
    if (!commentText) return;

    try {
      const res = await axios.post(`${API_BASE}/discussions/${threadId}/comments`, {
        text: commentText,
        postedBy: user._id,
      });
      const updatedThreads = threads.map(t => (t._id === res.data._id ? res.data : t));
      setThreads(updatedThreads);
      setFilteredThreads(updatedThreads);
      if (selectedThread?._id === res.data._id) {
        setSelectedThread(res.data);
      }
    } catch (error) {
      alert("Failed to post comment.");
    }
  };

  if (!user) {
    return <p className="text-center mt-6 text-pink-400 font-semibold text-lg animate-pulse">Please login to see discussions.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-sky-50 via-pink-50 to-pink-100 min-h-screen rounded-xl shadow-md">
      <h2 className="text-4xl font-extrabold mb-8 text-sky-600 select-none animate-fadeInDown">
        {resourceId ? "PDF Discussion" : "General Discussion"}
      </h2>

      {/* New thread creation */}
      <div className="flex mb-8 gap-4">
        <input
          className="flex-grow border-2 border-pink-300 rounded-xl p-4 text-lg font-semibold placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-shadow shadow-sm hover:shadow-md active:scale-95"
          type="text"
          placeholder="Start a new thread"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createThread()}
        />
        <button
          className="bg-gradient-to-r from-sky-300 to-pink-300 text-white px-8 rounded-xl font-bold shadow-md hover:from-pink-300 hover:to-sky-300 transform transition hover:scale-105 active:scale-95 select-none"
          onClick={createThread}
          title="Start a New Thread"
        >
          Start
        </button>
      </div>

      {/* Search bar */}
      <div className="flex mb-8 gap-3">
        <input
          className="flex-grow border-2 border-sky-300 rounded-xl p-3 text-lg font-semibold placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-shadow shadow-sm hover:shadow-md active:scale-95"
          type="text"
          placeholder="Search discussions"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-gradient-to-r from-pink-300 to-sky-300 text-white px-7 rounded-xl font-bold shadow-md hover:from-sky-300 hover:to-pink-300 transform transition hover:scale-105 active:scale-95 select-none"
          onClick={handleSearch}
          title="Search Threads"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center text-pink-400 font-semibold text-xl animate-pulse">Loading discussions...</p>
      ) : (
        <div className="flex gap-8">
          {/* Thread list */}
          <ul className="w-1/3 max-h-[550px] overflow-y-auto border-4 border-pink-200 rounded-3xl bg-white shadow-lg p-5 animate-fadeInLeft">
            {filteredThreads.length === 0 ? (
              <p className="text-pink-300 text-center mt-10 text-xl font-semibold">No discussions found.</p>
            ) : (
              filteredThreads.map(thread => (
                <li
                  key={thread._id}
                  className={`cursor-pointer p-4 rounded-2xl mb-4 bg-gradient-to-r ${
                    selectedThread?._id === thread._id
                      ? "from-sky-300 to-pink-200 shadow-inner shadow-pink-400 text-sky-700 font-semibold scale-105 animate-pulse"
                      : "from-pink-100 to-sky-100 hover:from-pink-150 hover:to-sky-150 transition transform hover:scale-105"
                  } select-none`}
                  onClick={() => setSelectedThread(thread)}
                  title={thread.title}
                >
                  <div className="text-lg truncate">{thread.title}</div>
                  <div className="text-xs italic text-sky-500 mt-1 select-text">{thread.createdBy?.name || "Unknown"}</div>
                </li>
              ))
            )}
          </ul>

          {/* Selected thread view */}
          <div className="w-2/3 min-h-[550px]">
            {selectedThread ? (
              <Thread thread={selectedThread} user={user} onAddComment={addComment} />
            ) : (
              <p className="text-center text-pink-400 mt-28 text-2xl font-semibold select-none">
                Select a discussion to view or comment
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscussionBoard;
