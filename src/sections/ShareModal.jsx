import React from "react";
import { FaWhatsapp, FaTelegramPlane, FaEnvelope, FaLink, FaTimes } from "react-icons/fa";

const ShareModal = ({ resource, onClose, setCopiedMessage }) => {
  const siteLink = "http://academic-resource-hub-frontend.vercel.app/"; 

  const msg = `Hey! Check out this awesome resource: "${resource.title}" for ${resource.subject} - Unit ${resource._unitNumber || resource.unitNumber}`;

  const handleCopyLink = (url) => {
    const fullMessage = `${msg}\n${url}\nCheck out more PDFs here: ${siteLink}`;
    navigator.clipboard.writeText(fullMessage);
    onClose();
    setCopiedMessage("Copied to clipboard!");
    setTimeout(() => setCopiedMessage(""), 4000);
  };

  return (
    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 z-50">
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded-full"
      >
        <FaTimes />
      </button>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(msg + "\n" + resource.file + "\nCheck out more PDFs here: " + siteLink)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition flex items-center justify-center"
      >
        <FaWhatsapp />
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(resource.file)}&text=${encodeURIComponent(msg + "\nCheck out more PDFs here: " + siteLink)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition flex items-center justify-center"
      >
        <FaTelegramPlane />
      </a>

      {/* Email */}
      <a
        href={`mailto:?subject=Check this resource&body=${encodeURIComponent(msg + "\n" + resource.file + "\nCheck out more PDFs here: " + siteLink)}`}
        className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition flex items-center justify-center"
      >
        <FaEnvelope />
      </a>

      {/* Copy Link */}
      <button
        onClick={() => handleCopyLink(resource.file)}
        className="bg-gray-300 text-gray-800 p-3 rounded-full hover:bg-gray-400 transition flex items-center justify-center"
      >
        <FaLink />
      </button>
    </div>
  );
};

export default ShareModal;
