import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_SOCKET_URL || import.meta.env.VITE_API_BASE);

export default function ThreadList({
  loading,
  threads,
  setSelectedThread,
  selectedThread,
  setFilteredThreads,
  setThreads,
  Skeleton,
  user,
  deleteThread,
}) {

  // =============================
  // 🔥 WebSocket Listeners
  // =============================
  useEffect(() => {
    // 🆕 New thread created (broadcast)
    socket.on("new_thread", (newThread) => {
      setThreads((prev) => [newThread, ...prev]);
      setFilteredThreads((prev) => [newThread, ...prev]);
    });

    // ❌ Thread deleted
    socket.on("thread_deleted", ({ threadId }) => {
      setThreads((prev) => prev.filter((t) => t._id !== threadId));
      setFilteredThreads((prev) => prev.filter((t) => t._id !== threadId));

      // If selected thread was deleted → clear it
      if (selectedThread?._id === threadId) {
        setSelectedThread(null);
      }
    });

    // 💬 New comment inside any thread (update reply count)
    socket.on("new_comment", ({ threadId }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? { ...t, comments: [...t.comments, {}] } // push placeholder to increase count
            : t
        )
      );

      setFilteredThreads((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? { ...t, comments: [...t.comments, {}] }
            : t
        )
      );
    });

    return () => {
      socket.off("new_thread");
      socket.off("thread_deleted");
      socket.off("new_comment");
    };
  }, [selectedThread, setThreads, setFilteredThreads, setSelectedThread]);

  // =============================
  // 🔥 UI Rendering
  // =============================
  return (
    <motion.section
      className="md:col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm h-[520px] overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Threads</h2>

      {loading ? (
        <div className="space-y-4">
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <div className="h-[440px] overflow-y-auto pr-2">
          <AnimatePresence initial={false}>
            {threads.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-slate-400 mt-14"
              >
                No discussions match your search.
              </motion.p>
            ) : (
              threads.map((thread) => (
                <motion.div
                  key={thread._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`mb-3 p-3 rounded-xl cursor-pointer border ${
                    selectedThread?._id === thread._id
                      ? "border-indigo-300 bg-indigo-50 shadow-inner"
                      : "border-slate-100 bg-white"
                  }`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Left Section */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {thread.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Started by {thread.createdBy?.name || "Unknown"} •{" "}
                        {(thread.comments || []).length} replies
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-xs text-slate-400">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </div>

                      {/* Delete button only for creator */}
                      {user?._id ===
                        (thread.createdBy?._id || thread.createdBy) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteThread(thread._id, true);
                          }}
                          className="text-red-500 text-[11px] hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}
