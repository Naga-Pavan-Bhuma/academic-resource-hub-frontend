import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import NavbarLoggedIn from "../sections/NavbarLoggedIn";
import ResourceSearch from "../sections/ResourceSearch";
import DiscussionBoard from "../sections/DiscussionBoard";
import Leaderboard from "../sections/Leaderboard";
import PageWrapper from "../sections/PageWrapper";
import Upload from "../sections/Upload";
import PDFViewer from "../sections/PDFViewer";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://10.196.162.7:5000/api";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewPdf, setViewPdf] = useState(null);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg animate-pulse">
        Loading dashboard...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        ⚠️ User not found. Please login again.
      </div>
    );

  if (viewPdf) {
    return <PDFViewer file={viewPdf} onClose={() => setViewPdf(null)} />;
  }

  return (
    <div className="min-h-screen bg-white relative">
      <NavbarLoggedIn userName={user.name} profileImg={user.profileImg} />

      <Routes>
        <Route path="/" element={<Navigate to="resources" />} />
        <Route
          path="resources"
          element={
            <PageWrapper>
              <ResourceSearch setViewPdf={setViewPdf} />
            </PageWrapper>
          }
        />
        <Route
          path="discussions"
          element={
            <PageWrapper>
              <DiscussionBoard />
            </PageWrapper>
          }
        />
        <Route
          path="upload"
          element={
            <PageWrapper>
              <Upload user={user} />
            </PageWrapper>
          }
        />
        <Route
          path="leaderboard"
          element={
            <PageWrapper>
              <Leaderboard user={user} />
            </PageWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default StudentDashboard;
