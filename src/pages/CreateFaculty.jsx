import React, { useState } from "react";
import axios from "axios";
import NavbarLoggedIn from "../sections/NavbarLoggedIn";
import PageWrapper from "../sections/PageWrapper";

const API = import.meta.env.VITE_API_BASE;

const CreateFaculty = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const createFaculty = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API}/users/create-faculty`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Faculty created!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarLoggedIn userName="Admin" />

      <PageWrapper>
        <h2 className="text-3xl font-bold text-cyan-500 mb-6">
          Create Faculty
        </h2>

        <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
          <input
            value={form.name}
            placeholder="Name"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            value={form.email}
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            value={form.password}
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            onClick={createFaculty}
            className="bg-cyan-500 text-white px-4 py-2 rounded w-full"
          >
            Create Faculty
          </button>
        </div>
      </PageWrapper>
    </div>
  );
};

export default CreateFaculty;