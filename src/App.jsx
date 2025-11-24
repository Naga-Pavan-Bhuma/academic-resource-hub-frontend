import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import { Toaster } from "react-hot-toast";
import RequireAuth from "./sections/RequireAuth";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ALL STUDENT FEATURES (PROTECTED) */}
        <Route
          path="/student/*"
          element={
            <RequireAuth>
              <StudentDashboard />
            </RequireAuth>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
