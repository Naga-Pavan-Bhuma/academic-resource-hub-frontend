import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaUndo,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "./RatingStars";

const PDFToolbar = ({
  scale,
  setScale,
  rotate,
  setRotate,
  currentPage,
  numPages,
  prevPage,
  nextPage,
  downloadPDF,
  onClose,
  resourceId,
  userId,
  downloadCount,
}) => {
  const [isCompact, setIsCompact] = useState(window.innerWidth < 640);
  const [isVisible, setIsVisible] = useState(true);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide toolbar slightly on scroll
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setIsVisible(current < lastScroll || current < 50);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={{
        y: isVisible ? 0 : -70,
        opacity: isVisible ? 1 : 0.85,
      }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 w-full z-50 px-4 py-2 flex flex-wrap items-center justify-between gap-3
        bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-md"
    >
      {/* --- Left Group (Zoom & Rotate) --- */}
      {!isCompact && (
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 shadow-sm">
          <button
            onClick={() => setScale((s) => s + 0.2)}
            className="p-2 rounded-full hover:bg-white/40 text-gray-800 transition-all shadow-sm hover:scale-105"
            title="Zoom In"
          >
            <FaPlus />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.2))}
            className="p-2 rounded-full hover:bg-white/40 text-gray-800 transition-all shadow-sm hover:scale-105"
            title="Zoom Out"
          >
            <FaMinus />
          </button>
          <button
            onClick={() => setRotate((r) => (r + 90) % 360)}
            className="p-2 rounded-full hover:bg-white/40 text-gray-800 transition-all shadow-sm hover:scale-105"
            title="Rotate"
          >
            <FaUndo />
          </button>
        </div>
      )}

      {/* --- Middle Group (Page Nav + Download) --- */}
      <div
        className={`flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 shadow-sm ${
          isCompact ? "px-3 py-1" : ""
        }`}
      >
        {/* Previous Page */}
        <button
          onClick={prevPage}
          className="p-2 rounded-full hover:bg-white/40 text-gray-800 flex items-center gap-1 transition-all shadow-sm hover:scale-105"
          title="Previous Page"
        >
          <FaArrowLeft />
        </button>

        {/* Page Number */}
        {!isCompact && (
          <span className="text-sm text-gray-700 font-medium bg-white/10 px-2 rounded-full">
            {currentPage} / {numPages}
          </span>
        )}

        {/* Next Page */}
        <button
          onClick={nextPage}
          className="p-2 rounded-full hover:bg-white/40 text-gray-800 flex items-center gap-1 transition-all shadow-sm hover:scale-105"
          title="Next Page"
        >
          <FaArrowRight />
        </button>

        {/* Download Button */}
        <div className="relative flex items-center">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-medium rounded-full transition-all shadow-md hover:scale-105"
            title="Download PDF"
          >
            <FaDownload />
            {!isCompact && <span>Download</span>}
          </button>

          {/* Animated Download Count */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={downloadCount}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute -top-2 -right-3 bg-white text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full shadow"
            >
              {downloadCount}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Right Group (Rating + Close) --- */}
      <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 shadow-sm">
        {/* Rating Stars */}
        <RatingStars resourceId={resourceId} userId={userId} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-all shadow-sm hover:scale-105"
          title="Close Viewer"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
};

export default PDFToolbar;
