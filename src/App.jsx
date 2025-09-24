// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page for everyone before login */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Dashboard */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* Later you can add protected routes here */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
