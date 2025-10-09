import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaFilePdf, FaUsers, FaEye, FaDownload, FaStar } from "react-icons/fa";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const StudentStats = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [stats, setStats] = useState({
    pdfsUploaded: 0,
    totalUsers: 0,
    pdfViews: 0,
    pdfDownloads: 0,
    avgRating: 0,
  });

  const [inView, setInView] = useState(false);
  const ref = React.useRef(null);

  // Intersection observer for animating CountUp
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await axios.get(`${API_BASE}/users/count`);
        const totalUsers = usersRes.data.totalUsers || 0;

        const resourcesRes = await axios.get(`${API_BASE}/resources`);
        const resources = Array.isArray(resourcesRes.data)
          ? resourcesRes.data
          : [];

        const pdfsUploaded = resources.length;
        const pdfViews = resources.reduce((acc, r) => acc + (r.views || 0), 0);
        const pdfDownloads = resources.reduce(
          (acc, r) => acc + (r.downloads || 0),
          0
        );

        const ratedResources = resources.filter((r) => r.avgRating > 0);
        const totalRatings = ratedResources.reduce(
          (acc, r) => acc + r.avgRating,
          0
        );
        const avgRating =
          ratedResources.length > 0
            ? (totalRatings / ratedResources.length).toFixed(1)
            : 0;

        setStats({
          totalUsers,
          pdfsUploaded,
          pdfViews,
          pdfDownloads,
          avgRating,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [API_BASE]);

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-blue-500" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "PDFs Uploaded",
      value: stats.pdfsUploaded,
      icon: <FaFilePdf className="text-red-500" />,
      color: "from-red-400 to-red-600",
    },
    {
      title: "PDF Views",
      value: stats.pdfViews,
      icon: <FaEye className="text-green-500" />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "PDF Downloads",
      value: stats.pdfDownloads,
      icon: <FaDownload className="text-yellow-500" />,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Avg Rating",
      value: stats.avgRating,
      icon: <FaStar className="text-purple-500" />,
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* 🌈 Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-32 -right-32 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <h2 className="relative text-4xl md:text-5xl font-bold text-center text-cyan-500 mb-12 font-fredoka z-10 drop-shadow-md">
        Platform Stats & Achievements
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 z-10 relative">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${stat.color} opacity-20 blur-3xl scale-110 transition-all duration-500 group-hover:opacity-40 group-hover:scale-125 rounded-3xl`}
            ></div>

            <div className="text-5xl mb-4 z-10 relative">{stat.icon}</div>

            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 z-10 relative">
              {inView ? (
                <CountUp
                  end={
                    stat.title === "Avg Rating"
                      ? parseFloat(stat.value)
                      : stat.value
                  }
                  duration={1.5}
                  separator=","
                  decimals={stat.title === "Avg Rating" ? 1 : 0}
                />
              ) : (
                0
              )}
              {stat.title === "Avg Rating" && " / 5"}
            </span>

            <p className="text-gray-700 mt-2 font-medium z-10 relative text-lg">
              {stat.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StudentStats;
