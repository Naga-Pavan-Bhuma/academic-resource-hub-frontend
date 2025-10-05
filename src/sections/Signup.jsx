import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// ===== API BASE =====
const API_BASE = import.meta.env.VITE_API_BASE;

const signupUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/signup`, userData);
    return res.data;
  } catch (err) {
    if (err.response)
      throw new Error(err.response.data.message || "Backend error");
    else if (err.request)
      throw new Error("Network error: cannot reach backend");
    else throw new Error(err.message);
  }
};

const Signup = () => {
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [mobile, setMobile] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // OTP state
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();

  // ===== Handle Signup =====
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (!isVerified) {
      setMessage({
        text: "Please verify your email before signing up",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser({
        name,
        collegeId,
        email: email + "@rguktrkv.ac.in",
        mobile,
        year,
        branch,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setMessage({ text: "Signup successful 🎉", type: "success" });
        navigate("/student");
      } else {
        setMessage({ text: data.message || "Signup failed", type: "error" });
      }
    } catch (err) {
      const errorMsg = err.message || "Signup failed";
      setMessage({ text: errorMsg, type: "error" });
      if (errorMsg.toLowerCase().includes("already exists")) {
        setIsVerified(false); // let them retry OTP
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== Handle OTP input =====
  const handleOtpChange = (val, idx) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
      if (val && idx < 5) {
        document.getElementById(`otp-${idx + 1}`).focus();
      }
    }
  };

  // ===== Resend Timer =====
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ===== Send OTP =====
  const sendOtp = async () => {
    if (!email) {
      setMessage({ text: "Please enter email prefix first", type: "error" });
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, {
        email: email + "@rguktrkv.ac.in",
      });
      setOtpModal(true);
      setResendTimer(60);
      setMessage({ text: "OTP sent successfully!", type: "success" });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error sending OTP",
        type: "error",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // ===== Verify OTP =====
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, {
        email: email + "@rguktrkv.ac.in",
        otp: enteredOtp,
      });

      if (res.data.message?.toLowerCase().includes("otp verified")) {
        setIsVerified(true);
        setOtpModal(false);
        setMessage({ text: "✅ Email verified successfully", type: "success" });
      } else {
        setMessage({
          text: "⚠️ " + (res.data.message || "OTP verification failed"),
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text:
          "⚠️ " + (err.response?.data?.message || "OTP verification failed"),
        type: "error",
      });
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

        {message.text && (
          <div
            className={`mx-auto mb-4 px-4 py-2 rounded-lg text-center w-full max-w-md transition-all duration-300 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : message.type === "error"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {message.text}
          </div>
        )}

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

          {/* Email + Verify OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Email
            </label>

            {/* Flex container: column on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Enter Email Prefix"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-l-lg sm:rounded-l-lg sm:rounded-r-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
                  required
                  disabled={isVerified}
                />
                <span className="px-3 py-3 border-t border-b border-r border-gray-300 bg-gray-100 text-gray-700 select-none sm:inline rounded-r-lg">
                  @rguktrkv.ac.in
                </span>
              </div>

              {/* Send OTP button */}
              {!isVerified && (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={otpLoading || !email}
                  className={`w-full sm:w-auto px-3 py-3 rounded-lg text-white whitespace-nowrap text-sm transition-colors ${
                    otpLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {otpLoading ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>

            {isVerified && (
              <p className="text-green-600 text-sm mt-2 font-semibold">
                ✅ Mail verified successfully
              </p>
            )}
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
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
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
                {showConfirm ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transform hover:scale-[1.02] transition-all duration-300 shadow-lg 
             bg-gradient-to-r from-cyan-300 to-cyan-500 text-white hover:shadow-xl"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <hr className="border-gray-300" />

          {/* Already have account */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* OTP Modal */}
      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50 backdrop-blur-md p-4 sm:p-0">
          <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative animate-fadeIn">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2 tracking-wide">
              🔒 Verify Your Email
            </h3>
            <p className="text-center text-sm sm:text-base text-gray-700 mb-4">
              Enter the OTP sent to your college email.
              <br />
              OTP expires in 5 minutes. Each OTP is single-use.
            </p>

            <form
              onSubmit={handleOtpSubmit}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex justify-center gap-2 mb-2">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength="1"
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 animate-neon"
                    placeholder="•"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={sendOtp}
                disabled={resendTimer > 0}
                className={`text-sm sm:text-base underline mb-2 ${
                  resendTimer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-cyan-500 hover:text-cyan-400"
                }`}
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </button>

              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                Verify OTP
              </button>
            </form>

            <button
              onClick={() => setOtpModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg sm:text-xl font-bold"
            >
              ✕
            </button>

            <style>
              {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }

          @keyframes neonPulse {
            0% { box-shadow: 0 0 4px #00ffff, 0 0 8px #00ffff; }
            50% { box-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff; }
            100% { box-shadow: 0 0 4px #00ffff, 0 0 8px #00ffff; }
          }
          .animate-neon:focus {
            animation: neonPulse 1s infinite;
          }
        `}
            </style>
          </div>
        </div>
      )}

      {/* Blob Animation */}
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
