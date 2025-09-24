// src/pages/Signup.jsx
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { signupUser } from "../api";
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

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showOTP, setShowOTP] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Handlers

  // ...

  const handleSendOtp = async () => {
    try {
      console.log("req.body:", req.body);
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: email + "@rguktrkv.ac.in",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.data.success) {
        alert("OTP sent to your college email 📩");
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      alert("Error sending OTP");
      console.error(err);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

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
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email.endsWith("@rguktrkv.ac.in"))
        return alert("Use college email");

      const res = await signupUser({
        name: user.displayName,
        email: user.email,
        password: Math.random().toString(36).slice(-8),
        collegeId: "N/A",
        mobile: "",
        year: "",
        branch: "",
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
        alert("Google signup successful!");
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("Google sign-in failed");
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: email + "@rguktrkv.ac.in",
          otp,
        }
      );

      if (res.data.success) {
        setIsOtpVerified(true);
        alert("OTP verified ✅");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Verification failed");
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
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
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
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Email
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex flex-1 items-center">
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
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Send OTP
              </button>
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

      {/* OTP Modal */}
      {showOTP && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 animate-scaleIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Verify OTP
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              An OTP has been sent to{" "}
              <span className="font-medium">{email}@rguktrkv.ac.in</span>
            </p>

            <div className="flex justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-10 h-12 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Verify
            </button>
          </div>
        </div>
      )}

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
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default Signup;
