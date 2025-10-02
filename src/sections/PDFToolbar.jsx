import React from "react";
import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaUndo,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import RatingStars from "./RatingStars"; // import the rating component

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
  resourceId, // resource _id for rating
  userId,     // logged-in user ID for rating
}) => {
  return (
    <div className="bg-white w-full flex flex-wrap items-center justify-between px-4 py-2 shadow-md gap-2">
      
      {/* Zoom & Rotate */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setScale((s) => s + 0.2)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaPlus />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.2, 0.2))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaMinus />
        </button>
        <button
          onClick={() => setRotate((r) => (r + 90) % 360)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaUndo />
        </button>
      </div>

      {/* Page Navigation & Download */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevPage}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <FaArrowLeft /> Prev
        </button>
        <span className="px-2 font-medium text-gray-700">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={nextPage}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          Next <FaArrowRight />
        </button>
        <button
          onClick={downloadPDF}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
        >
          <FaDownload /> Download
        </button>
      </div>

      {/* Rating & Close */}
      <div className="flex items-center gap-3">
        <RatingStars resourceId={resourceId} userId={userId} /> {/* Pass userId */}
        <button
          onClick={onClose}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default PDFToolbar;
