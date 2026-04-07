import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyan-500">
        Pending Approvals
      </h2>

      <div className="grid gap-4">
        {pending.map((r) => (
          <div className="p-4 bg-white shadow rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-500">{r.subject}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => approve(r._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => reject(r._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;