import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PdfSummary = ({ pdfUrl }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_BASE}/pdf/summarize`,
      { pdfUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSummary(res.data.summary);
  } catch (err) {
    console.error(err);
    alert("Failed to generate summary");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-full flex flex-col p-4 gap-4">

      <button
        onClick={generateSummary}
        disabled={loading}
        className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md text-sm font-semibold"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap">
        {summary || (
          <span className="text-gray-400">
            Click “Generate Summary” to get AI-generated notes.
          </span>
        )}
      </div>
    </div>
  );
};

export default PdfSummary;
