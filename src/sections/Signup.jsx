// src/pages/Signup.jsx
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";

const Signup = () => {
  // Form state
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [mobile, setMobile] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ====== Signup ======
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        collegeId,
        email: email + "@rguktrkv.ac.in",
        mobile,
        year,
        branch,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Signup successful 🎉");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ====== Google Signin ======
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email.endsWith("@rguktrkv.ac.in"))
        return alert("Use your college email only");

      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: user.displayName,
        email: user.email,
        password: Math.random().toString(36).slice(-8), // random pwd
        collegeId: "N/A",
        mobile: "",
        year: "",
        branch: "",
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Google signup successful 🎉");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Google sign-in failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden pt-24">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-xl border border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSignup}>
          {/* Name + College ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
            <input
              type="text"
              placeholder="College ID Number"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Mobile + Year + Branch */}
          <div className="grid grid-cols-12 gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="col-span-12 md:col-span-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="col-span-12 md:col-span-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="">Year</option>
              <option value="PUC-1">PUC-1</option>
              <option value="PUC-2">PUC-2</option>
              <option value="Engg-1">Engg-1</option>
              <option value="Engg-2">Engg-2</option>
              <option value="Engg-3">Engg-3</option>
              <option value="Engg-4">Engg-4</option>
            </select>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="col-span-12 md:col-span-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="">Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="CHEM">CHEM</option>
              <option value="MME">MME</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Email
            </label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter Email Prefix"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
              <span className="px-3 py-3 border-t border-b border-r border-gray-300 bg-gray-100 rounded-r-lg text-gray-700 select-none">
                @rguktrkv.ac.in
              </span>
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium transform hover:scale-[1.02] transition-all duration-300 shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="flex items-center gap-2 border py-3 px-4 rounded-lg w-full justify-center hover:bg-gray-50 transition"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>
      </div>

      {/* Blob Animations */}
      <style>{`
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
