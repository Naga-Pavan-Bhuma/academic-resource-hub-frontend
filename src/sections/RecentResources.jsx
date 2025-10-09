import React, { useEffect, useState } from "react";
import axios from "axios";
import ResourceCard from "./ResourceCard";
import PDFViewer from "./PDFViewer";

const RecentResources = ({ year, branch, userId }) => {
  const [resources, setResources] = useState([]);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [currentPdf, setCurrentPdf] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchRecentResources = async () => {
      try {
        if (!year || !branch) return;

        const res = await axios.get(`${API_BASE}/resources`, {
          params: { year, branch },
        });

        if (Array.isArray(res.data)) {
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setResources(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching recent resources:", err);
      }
    };

    fetchRecentResources();
  }, [year, branch]);

  if (!resources.length) return null;

  return (
    <section className="relative my-12 max-w-7xl mx-auto px-4 overflow-hidden min-h-[400px] md:min-h-[400px]">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-32 -right-32 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <h3 className="text-3xl md:text-3xl text-center font-fredoka font-bold text-cyan-500 mb-6 mt-6 relative z-10">
        Recent Resources for {year} - {branch}
      </h3>

      <div className="mt-8 ml-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            userId={userId}
            setCopiedMessage={setCopiedMessage}
            onViewPdf={(file) => setCurrentPdf(file)}
          />
        ))}
      </div>
      {currentPdf && (
        <PDFViewer file={currentPdf} onClose={() => setCurrentPdf(null)} />
      )}
      {/* Toast for bookmark/share actions */}
      {copiedMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg z-50 animate-fadeIn">
          {copiedMessage}
        </div>
      )}
    </section>
  );
};

export default RecentResources;
