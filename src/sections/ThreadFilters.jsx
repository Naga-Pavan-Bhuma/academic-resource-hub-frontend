import React from "react";

export default function ThreadFilters({ threads, setFilteredThreads, setSelectedThread }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Quick filters</h3>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setFilteredThreads(threads);
            setSelectedThread(null);
          }}
          className="px-3 py-1 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          All
        </button>
        <button
          onClick={() => {
            const recent = [...threads].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setFilteredThreads(recent);
            setSelectedThread(null);
          }}
          className="px-3 py-1 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Recent
        </button>
        <button
          onClick={() => {
            const active = threads.filter((t) => (t.comments || []).length > 0);
            setFilteredThreads(active);
            setSelectedThread(null);
          }}
          className="px-3 py-1 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Active
        </button>
      </div>

      <div className="mt-6 text-xs text-slate-400">
        <strong>Keyboard tips:</strong>
        <ul className="mt-2 list-disc list-inside">
          <li>Enter to submit thread or search</li>
          <li>Arrow keys to navigate within thread list (works with focus)</li>
        </ul>
      </div>
    </div>
  );
}
