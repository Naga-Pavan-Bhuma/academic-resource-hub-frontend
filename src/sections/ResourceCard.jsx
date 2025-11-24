import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBook,
  FaEye,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import ShareModal from "./ShareModal";
import axios from "axios";

const ResourceCard = ({
  resource,
  onViewPdf,
  setCopiedMessage,
  userId,
  refreshBookmarks,
}) => {
  const [shareResource, setShareResource] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const shareBtnRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const avgRating = resource.avgRating || 0;
  const ratingCount = resource.ratingCount || 0;
  const [views, setViews] = useState(resource.views || 0);
  // ✅ Check if resource is already bookmarked
  useEffect(() => {
    if (!userId || !resource?._id) return;

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/bookmarks/${userId}`);
        const isBookmarked = res.data.some((r) => r._id === resource._id);
        setBookmarked(isBookmarked);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookmarks();
  }, [resource._id, userId]);
  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await axios.get(`${API_BASE}/resources/${resource._id}`);
      setViews(res.data.views);
    } catch (err) {
      console.error(err);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [resource._id]);

  const handleViewPdf = async (file) => {
  onViewPdf(file);

  try {
    const res = await axios.patch(`${API_BASE}/resources/${resource._id}/view`);
    setViews(res.data.views); // update the counter immediately
  } catch (err) {
    console.error("Error incrementing view count:", err);
  }
};


  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await axios.delete(`${API_BASE}/bookmarks/${resource._id}`, {
          data: { userId },
        });
        setCopiedMessage("Bookmark removed ❌");
      } else {
        await axios.post(`${API_BASE}/bookmarks/${resource._id}`, { userId });
        setCopiedMessage("Bookmark added ✅");
      }

      setBookmarked(!bookmarked);
      if (refreshBookmarks) refreshBookmarks();
      // Auto-hide toast after 2s
      setTimeout(() => setCopiedMessage(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Determine if resource is new (added in last 7 days)
  const isNew = (addedDate) => {
    if (!addedDate) return false;
    const today = new Date();
    const resourceDate = new Date(addedDate);
    const diffDays = (today - resourceDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white/20 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/30 hover:shadow-2xl transition"
    >
      {/* NEW Badge */}
      {isNew(resource.createdAt) && (
        <span
          className="absolute top-4 right-10 px-2 py-1 rounded-full text-xs font-bold text-white z-10 
    bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600
    animate-gradient-x shadow-md"
        >
          NEW
        </span>
      )}

      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className={`absolute top-4 right-4 text-xl hover:scale-110 transition-transform ${
          bookmarked ? "text-cyan-500" : "text-gray-400 hover:text-cyan-400"
        }`}
        title={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <FaBook className="text-cyan-400 text-2xl" />
        <h3 className="font-semibold text-lg text-gray-900">
          {resource.title}
        </h3>
      </div>

      {/* Uploaded & ID */}
      <p className="text-sm text-gray-700 mb-1">
        Uploaded by <span className="font-medium">{resource.uploadedBy}</span>
      </p>
      <p className="text-sm text-gray-700 mb-2">
        ID:{" "}
        <span className="font-medium">
          {resource._collegeId || resource.collegeId}
        </span>
      </p>

      {/* Unit + Rating inline */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Unit:{" "}
          <span className="font-medium">
            {resource._unitNumber || resource.unitNumber}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <span
            className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-sm font-medium flex items-center gap-1"
            title="Average rating out of 5"
          >
            ★ {avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-600">({ratingCount})</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="bg-cyan-100/40 text-cyan-800 text-xs px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200">
          {resource.subject}
        </span>
        <span className="bg-purple-100/40 text-purple-800 text-xs px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200">
          {resource.year}
        </span>
        <span className="bg-pink-100/40 text-pink-800 text-xs px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition-transform duration-200">
          {resource.sem}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3 relative">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleViewPdf(resource.file)}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-2xl hover:opacity-90 shadow-md transition"
        >
          <FaEye /> View PDF
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          ref={shareBtnRef}
          onClick={() => setShareResource(resource)}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-3 rounded-2xl hover:bg-gray-300 hover:scale-105 transition"
        >
          <FaShareAlt /> Share
        </motion.button>

        {shareResource && (
          <ShareModal
            resource={resource}
            onClose={() => setShareResource(null)}
            setCopiedMessage={setCopiedMessage}
          />
        )}
        {/* Views */}
        <div className="flex items-center gap-1 text-gray-600 text-sm font-medium">
          <FaEye className="text-cyan-500" />
          <span>{views || 0}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;