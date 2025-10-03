import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThreadList({ loading, threads, selectedThread, setSelectedThread, Skeleton }) {
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
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setSelectedThread(thread)
                  }
                  aria-label={`Open thread ${thread.title}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {thread.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Started by {thread.createdBy?.name || "Unknown"} •{" "}
                        {(thread.comments || []).length} replies
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      {new Date(thread.createdAt).toLocaleDateString()}
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
