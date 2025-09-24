// src/pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ====== Handle Login ======
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email + "@rguktrkv.ac.in",
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Login successful 🎉");
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

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: user.email,
        password: "google-auth",
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Google login successful 🎉");
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
            className="w-full py-3 rounded-lg font-medium transform hover:scale-[1.02] transition-all duration-300 shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl"
          >
            Login
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
