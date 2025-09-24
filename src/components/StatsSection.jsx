import React from "react";

const StatsSection = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="p-5 bg-white rounded-xl shadow border-l-4 border-cyan-500">
        <p className="text-sm text-gray-500">Downloads</p>
        <p className="text-3xl font-bold text-gray-800">{stats.downloads}</p>
      </div>
      <div className="p-5 bg-white rounded-xl shadow border-l-4 border-blue-500">
        <p className="text-sm text-gray-500">Doubts Posted</p>
        <p className="text-3xl font-bold text-gray-800">{stats.doubts}</p>
      </div>
      <div className="p-5 bg-white rounded-xl shadow border-l-4 border-emerald-500">
        <p className="text-sm text-gray-500">Contributions Approved</p>
        <p className="text-3xl font-bold text-gray-800">{stats.contributions}</p>
      </div>
    </div>
  );
};

export default StatsSection;
