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
  const [copiedMessage, setCopiedMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(false); // ← new state
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const userId = user?._id;
  const API_BASE = import.meta.env.VITE_API_BASE;

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Fetch user failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch all resources
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

  // Fetch bookmarked resources for the user
  useEffect(() => {
    if (!userId) return;

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/bookmarks/${userId}`);
        setBookmarkedResources(res.data);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [userId]);

  // Filter resources based on search, filters, and bookmarks toggle
  const filteredResources = (
    showBookmarks ? bookmarkedResources : resources
  ).filter(
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
        {/* Centered Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 text-center mb-4">
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
{/* Bookmark button */}
        <div className="flex justify-center md:justify-end mb-6">
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`px-5 py-2 rounded-full font-medium shadow-md transition duration-300 ${
              showBookmarks
                ? "bg-cyan-500 text-white hover:bg-cyan-600"
                : "bg-white/60 text-gray-800 hover:bg-cyan-100 border border-cyan-300/40 backdrop-blur-md"
            }`}
          >
            {showBookmarks ? "★ Bookmarked" : "☆ Bookmarks"}
          </button>
        </div>
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res._id || res.id}
                resource={res}
                onViewPdf={setViewPdf}
                setCopiedMessage={setCopiedMessage}
                userId={userId}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 font-medium mt-10">
            😔 No resources found!
          </p>
        )}

        {viewPdf && (
          <PDFViewerWrapper file={viewPdf} onClose={() => setViewPdf(null)} />
        )}
      </section>

      {copiedMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md text-cyan-500 px-4 py-2 rounded-xl shadow-lg border border-white/30 z-[9999]">
          {copiedMessage}
        </div>
      )}
    </>
  );
};

export default ResourceSearch;
