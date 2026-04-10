import React, { useEffect, useState } from "react";
import axios from "axios";

import NavbarLoggedIn from "../sections/NavbarLoggedIn";
import PageWrapper from "../sections/PageWrapper";

const API = import.meta.env.VITE_API_BASE;

const FacultyDashboard = () => {
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}/resources/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPending(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id) => {
    const token = localStorage.getItem("token");

    await axios.patch(`${API}/resources/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchPending();
  };

  const reject = async (id) => {
    const token = localStorage.getItem("token");

    await axios.patch(`${API}/resources/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchPending();
  };

  const [openPreview, setOpenPreview] = useState(null);

 return (
  <div className="min-h-screen bg-white">

    {/* ✅ NAVBAR */}
    <NavbarLoggedIn userName="Faculty" />

    <PageWrapper>
      <h2 className="text-3xl font-bold mb-6 text-cyan-500">
        Pending Approvals
      </h2>

      <div className="grid gap-4">
        {pending.length === 0 && (
          <p className="text-gray-500">No pending PDFs</p>
        )}

        {pending.map((r) => (
  <div
    key={r._id}
    className="p-4 bg-white shadow rounded-xl flex flex-col gap-3"
  >
    {/* TOP SECTION */}
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{r.title}</h3>

        <span className={`text-xs px-2 py-1 rounded
  ${r.status === "pending" && "bg-yellow-100 text-yellow-700"}
  ${r.status === "approved" && "bg-green-100 text-green-700"}
  ${r.status === "rejected" && "bg-red-100 text-red-700"}
`}>
  {r.status}
</span>
        <p className="text-sm text-gray-500">{r.subject}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setOpenPreview(openPreview === r._id ? null : r._id)}
          className="bg-gray-200 px-3 py-1 rounded text-sm"
        >
          {openPreview === r._id ? "Hide" : "Preview"}
        </button>

        <button
          onClick={() => approve(r._id)}
          className="bg-green-500 text-white px-3 py-1 rounded hover:scale-105 transition"
        >
          Approve
        </button>

        <button
          onClick={() => reject(r._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:scale-105 transition"
        >
          Reject
        </button>
      </div>
    </div>

    {/* 🔥 PDF PREVIEW */}
    {openPreview === r._id && (
      <div className="border rounded-lg overflow-hidden">
        <iframe
          src={r.file}
          title="PDF Preview"
          className="w-full h-[400px]"
        />
      </div>
    )}
  </div>
))}
      </div>
    </PageWrapper>
  </div>
);
};

export default FacultyDashboard;