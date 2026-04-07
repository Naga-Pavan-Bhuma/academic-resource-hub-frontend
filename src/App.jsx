import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import { Toaster } from "react-hot-toast";
import RequireAuth from "./sections/RequireAuth";

import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>

  {/* PUBLIC ROUTES */}
  <Route path="/" element={<Home />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />

  {/* STUDENT */}
  <Route
    path="/student/*"
    element={
      <RequireAuth>
        <StudentDashboard />
      </RequireAuth>
    }
  />

  {/* FACULTY */}
  <Route
    path="/faculty"
    element={
      <RequireAuth>
        <FacultyDashboard />
      </RequireAuth>
    }
  />

  {/* ADMIN */}
  <Route
    path="/admin"
    element={
      <RequireAuth>
        <AdminDashboard />
      </RequireAuth>
    }
  />

</Routes>
    </Router>
  );
}

export default App;
