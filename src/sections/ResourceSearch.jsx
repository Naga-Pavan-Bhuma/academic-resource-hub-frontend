import React, { useEffect, useState } from "react";
import { FaBook, FaEye } from "react-icons/fa";
import axios from "axios";
import PDFViewer from "./PDFViewer";

const years = ["P1", "P2", "E1", "E2", "E3", "E4"];
const semesters = ["Sem-1", "Sem-2"];
const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "MME"];

const ResourceSearch = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(""); // added branch filter
  const [viewPdf, setViewPdf] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

  // Fetch resources from backend
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
      (selectedBranch ? res.branch === selectedBranch : true) // branch filter
  );

  return (
    <section className="p-6 min-h-screen bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-lg relative">
      <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 mb-8 text-center">
        Discover Your Resources
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search by subject, topic, uploaded by, or ID..."
          className="flex-1 p-3 rounded-full border border-white/50 bg-white/20 placeholder-gray-600 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
          className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">Branch</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res._id || res.id}
              className="bg-white/20 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/30 hover:scale-105 transition cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaBook className="text-cyan-400 text-2xl" />
                <h3 className="font-semibold text-lg text-gray-900">{res.title}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Uploaded by <span className="font-medium">{res.uploadedBy}</span>
              </p>
              <p className="text-sm text-gray-700 mb-2">
                ID: <span className="font-medium">{res._collegeId || res.collegeId}</span>
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Unit: <span className="font-medium">{res._unitNumber || res.unitNumber}</span>
              </p>
              <div className="flex gap-2 flex-wrap mb-5">
                <span className="bg-cyan-100/40 text-cyan-800 text-xs px-3 py-1 rounded-full">{res.subject}</span>
                <span className="bg-purple-100/40 text-purple-800 text-xs px-3 py-1 rounded-full">Year {res.year}</span>
                <span className="bg-pink-100/40 text-pink-800 text-xs px-3 py-1 rounded-full">{res.sem}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewPdf(res.file)}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-white py-2 rounded-2xl hover:bg-cyan-600 hover:scale-105 transition"
                >
                  <FaEye /> View PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 font-medium mt-10">😔 No resources found!</p>
      )}

      {/* Fullscreen PDF Viewer Overlay */}
      {viewPdf && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <PDFViewer file={viewPdf} onClose={() => setViewPdf(null)} />
        </div>
      )}
    </section>
  );
};

export default ResourceSearch;
