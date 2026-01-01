import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "./Filters";
import ResourceCard from "./ResourceCard";
import PDFViewerWrapper from "./PDFViewerWrapper";

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
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const userId = user?._id;

  // ---------------------------
  // FETCH USER
  // ---------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);

        // Default filters from profile
        if (res.data.user?.branch) setSelectedBranch(res.data.user.branch);
        if (res.data.user?.year) setSelectedYear(res.data.user.year);
      } catch (err) {
        console.error("User fetch failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ---------------------------
  // FETCH BOOKMARKS
  // ---------------------------
  const fetchBookmarks = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}/bookmarks/${userId}`);
      setBookmarkedResources(res.data);
    } catch (err) {
      console.error("Bookmark fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  // ---------------------------
  // 🔍 BACKEND SEARCH (INDEXED)
  // ---------------------------
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${API_BASE}/resources/search`, {
          params: {
            q: searchTerm || undefined,
            year: selectedYear || undefined,
            sem: selectedSem || undefined,
            branch: selectedBranch || undefined,
          },
        });
        setResources(res.data);
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    fetchResources();
  }, [searchTerm, selectedYear, selectedSem, selectedBranch]);

  const displayResources = showBookmarks ? bookmarkedResources : resources;

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <>
      <section className="p-6 min-h-screen bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-lg relative">
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

        {/* Bookmark Toggle */}
        <div className="flex justify-center md:justify-end mb-6">
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`px-5 py-2 rounded-full font-medium shadow-md transition ${
              showBookmarks
                ? "bg-cyan-500 text-white"
                : "bg-white/60 text-gray-800 border border-cyan-300/40"
            }`}
          >
            {showBookmarks ? "★ Bookmarked" : "☆ Bookmarks"}
          </button>
        </div>

        {displayResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResources.map((res) => (
              <ResourceCard
                key={res._id}
                resource={res}
                onViewPdf={setViewPdf}
                setCopiedMessage={setCopiedMessage}
                userId={userId}
                refreshBookmarks={fetchBookmarks}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 font-medium mt-10">
            😔 No resources found!
          </p>
        )}

        {viewPdf && (
          <PDFViewerWrapper
            file={viewPdf}
            onClose={() => setViewPdf(null)}
          />
        )}
      </section>

      {copiedMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-cyan-500 px-4 py-2 rounded-xl shadow-lg z-[9999]">
          {copiedMessage}
        </div>
      )}
    </>
  );
};

export default ResourceSearch;
