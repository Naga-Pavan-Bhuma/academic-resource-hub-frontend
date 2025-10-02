import React, { useState, useRef } from "react";
import { FaBook, FaEye, FaShareAlt } from "react-icons/fa";
import ShareModal from "./ShareModal";

const ResourceCard = ({ resource, onViewPdf, setCopiedMessage }) => {
  const [shareResource, setShareResource] = useState(null);
  const shareBtnRef = useRef(null);

  return (
    <div className="bg-white/20 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/30 hover:scale-105 transition relative">
      <div className="flex items-center gap-3 mb-2">
        <FaBook className="text-cyan-400 text-2xl" />
        <h3 className="font-semibold text-lg text-gray-900">{resource.title}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-2">
        Uploaded by <span className="font-medium">{resource.uploadedBy}</span>
      </p>
      <p className="text-sm text-gray-700 mb-2">
        ID: <span className="font-medium">{resource._collegeId || resource.collegeId}</span>
      </p>
      <p className="text-sm text-gray-700 mb-4">
        Unit: <span className="font-medium">{resource._unitNumber || resource.unitNumber}</span>
      </p>
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="bg-cyan-100/40 text-cyan-800 text-xs px-3 py-1 rounded-full">{resource.subject}</span>
        <span className="bg-purple-100/40 text-purple-800 text-xs px-3 py-1 rounded-full">Year {resource.year}</span>
        <span className="bg-pink-100/40 text-pink-800 text-xs px-3 py-1 rounded-full">{resource.sem}</span>
      </div>
      <div className="flex gap-2 mt-3 relative">
        <button
          onClick={() => onViewPdf(resource.file)}
          className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-white py-2 rounded-2xl hover:bg-cyan-600 hover:scale-105 transition"
        >
          <FaEye /> View PDF
        </button>

        <button
          ref={shareBtnRef}
          onClick={() => setShareResource(resource)}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-3 rounded-2xl hover:bg-gray-300 hover:scale-105 transition relative"
        >
          <FaShareAlt /> Share
        </button>

        {shareResource && (
          <ShareModal
            resource={resource}
            onClose={() => setShareResource(null)}
            setCopiedMessage={setCopiedMessage} // pass down toast setter
          />
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
