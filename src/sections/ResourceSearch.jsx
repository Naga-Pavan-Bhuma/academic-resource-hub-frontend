import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "./Filters";
import ResourceCard from "./ResourceCard";
import PDFViewerWrapper from "./PDFViewerWrapper"; // Portal wrapper

const ResourceSearch = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [viewPdf, setViewPdf] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState(""); // ← for toast

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${API_BASE}/resources`);
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(
    (res) =>
      (res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.collegeId?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedYear ? res.year === selectedYear : true) &&
      (selectedSem ? res.sem === selectedSem : true) &&
      (selectedBranch ? res.branch === selectedBranch : true)
  );

  return (
    <>
      <section className="p-6 min-h-screen bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-lg relative">
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 mb-8 text-center">
          Discover Your Resources
        </h2>

        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedSem={selectedSem}
          setSelectedSem={setSelectedSem}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res._id || res.id}
                resource={res}
                onViewPdf={setViewPdf}
                setCopiedMessage={setCopiedMessage} // ← pass setter
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 font-medium mt-10">😔 No resources found!</p>
        )}

        {/* Portal-based PDFViewer */}
        {viewPdf && <PDFViewerWrapper file={viewPdf} onClose={() => setViewPdf(null)} />}
      </section>

      {/* Bottom toast */}
      {copiedMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md text-cyan-500 px-4 py-2 rounded-xl shadow-lg border border-white/30 z-[9999]">
          {copiedMessage}
        </div>
      )}
    </>
  );
};

export default ResourceSearch;
