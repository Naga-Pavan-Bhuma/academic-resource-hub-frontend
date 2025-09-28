import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import NavbarLoggedIn from "../sections/NavbarLoggedIn";
import ResourceSearch from "../sections/ResourceSearch";
import DiscussionBoard from "../sections/DiscussionBoard";
import Leaderboard from "../sections/Leaderboard";
import PageWrapper from "../sections/PageWrapper";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
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
        User not found
      </div>
    );

  return (
    <div className="min-h-screen bg-white relative">
      <NavbarLoggedIn userName={user.name} profileImg={user.profileImg} />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="resources" />} />

        {/* Nested routes */}
        <Route
          path="resources"
          element={
            <PageWrapper>
              <ResourceSearch />
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
          path="leaderboard"
          element={
            <PageWrapper>
              <Leaderboard />
            </PageWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default StudentDashboard;
