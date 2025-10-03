import React, { useState } from "react";

export default function SearchBar({ threads, setFilteredThreads, setSelectedThread }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      setFilteredThreads(threads);
      setSelectedThread(null);
      return;
    }
    const filtered = threads.filter((t) => {
      const inTitle = (t.title || "").toLowerCase().includes(q);
      const inCreator = (t.createdBy?.name || "").toLowerCase().includes(q);
      const inText = (t.comments || []).some((c) => (c.text || "").toLowerCase().includes(q));
      return inTitle || inCreator || inText;
    });
    setFilteredThreads(filtered);
    setSelectedThread(null);
  };

  return (
    <div className="relative w-full md:w-96">
      <input
        aria-label="Search discussions"
        placeholder="Search threads, authors or comments"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="
          w-full
          rounded-full
          border border-white/30
          bg-white/20
          backdrop-blur-md
          px-4 py-2
          text-sm text-slate-900
          placeholder-slate-400
          shadow-md
          focus:outline-none
          focus:ring-2 focus:ring-indigo-300
          transition
          duration-300
          hover:shadow-lg
        "
      />
      <button
        onClick={handleSearch}
        aria-label="Search"
        className="
          absolute right-1 top-1/2 -translate-y-1/2
          bg-gradient-to-tr from-cyan-500 to-blue-500
          text-white
          rounded-full
          px-4 py-1.5
          text-sm font-semibold
          shadow-lg
          hover:brightness-110
          transform hover:scale-105
          transition
        "
      >
        Go
      </button>
    </div>
  );
}
