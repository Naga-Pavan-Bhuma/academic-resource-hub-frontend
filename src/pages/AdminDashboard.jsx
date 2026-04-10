import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarLoggedIn from "../sections/NavbarLoggedIn";
import PageWrapper from "../sections/PageWrapper";

const API = import.meta.env.VITE_API_BASE;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    faculty: 0,
    students: 0,
    resources: 0,
    views: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    { title: "Total Users", value: stats.users },
    { title: "Students", value: stats.students },
    { title: "Faculty", value: stats.faculty },
    { title: "Total PDFs", value: stats.resources },
    { title: "Total Views", value: stats.views },
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavbarLoggedIn userName="Admin" />

      <PageWrapper>
        <h2 className="text-4xl font-bold text-cyan-500 mb-8">
          Admin Dashboard
        </h2>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white transform hover:scale-105 transition"
            >
              <h3 className="text-lg">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;