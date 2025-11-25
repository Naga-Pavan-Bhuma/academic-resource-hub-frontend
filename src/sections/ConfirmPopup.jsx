import React from "react";
import { motion } from "framer-motion";

export default function ConfirmPopup({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl p-6 shadow-xl w-72 text-center"
      >
        <h3 className="text-lg font-semibold text-slate-800">
          Delete Thread?
        </h3>
        <p className="text-sm text-slate-500 mt-2">
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-sm hover:bg-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
