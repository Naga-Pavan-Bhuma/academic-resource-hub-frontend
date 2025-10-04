// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ===== API BASE =====
const API_BASE =
  import.meta.env.VITE_API_BASE;

// ===== API CALLS =====
const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data;
  } catch (err) {
    if (err.response)
      throw new Error(err.response.data.message || "Backend error");
    else if (err.request)
      throw new Error("Network error: cannot reach backend");
    else throw new Error(err.message);
  }
};

const loginUserWithGoogle = async (jwt) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/google-login`, {
      token: jwt,
    });
    return res.data;
  } catch (err) {
    if (err.response)
      throw new Error(err.response.data.message || "Backend error");
    else if (err.request)
      throw new Error("Network error: cannot reach backend");
    else throw new Error(err.message);
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ===== Handle email/password login =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(email + "@rguktrkv.ac.in", password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/student");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("⚠️ " + err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== Handle Google login response =====
  const handleGoogleResponse = async (response) => {
    try {
      const jwt = response.credential;
      const payload = JSON.parse(atob(jwt.split(".")[1]));

      if (!payload.email.endsWith("@rguktrkv.ac.in")) {
        return alert("Use your college email only");
      }

      const data = await loginUserWithGoogle(jwt);
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/student");
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("⚠️ Google sign-in failed: " + err.message);
    }
  };

  // ===== Render Google button without auto-popup =====
  useEffect(() => {
    const renderGoogleButton = () => {
      if (window.google && document.getElementById("googleSignInDiv")) {
        console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", width: "100%" }
        );

        // Removed auto-popup
        // google.accounts.id.prompt();
      }
    };

    if (window.google) renderGoogleButton();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden pt-24">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
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

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transform hover:scale-[1.02] transition-all duration-300 shadow-lg 
             bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-xl"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Sign-In */}
          <div id="googleSignInDiv" className="w-full"></div>
        </form>

        {/* Switch to Signup */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            Sign up
          </Link>
        </p>
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

export default Login;
