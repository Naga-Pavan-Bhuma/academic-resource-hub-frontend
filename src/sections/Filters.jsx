import React from "react";

const years = ["P1", "P2", "E1", "E2", "E3", "E4"];
const semesters = ["Sem-1", "Sem-2"];
const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "MME"];

const Filters = ({
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  selectedSem,
  setSelectedSem,
  selectedBranch,
  setSelectedBranch,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
      <input
        type="text"
        placeholder="Search by subject, topic, uploaded by, or ID..."
        className="flex-1 p-3 rounded-full border border-white/50 bg-white/20 placeholder-gray-600 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="">Year</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <select
        value={selectedSem}
        onChange={(e) => setSelectedSem(e.target.value)}
        className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="">Semester</option>
        {semesters.map((sem) => (
          <option key={sem} value={sem}>{sem}</option>
        ))}
      </select>
      <select
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
        className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="">Branch</option>
        {branches.map((branch) => (
          <option key={branch} value={branch}>{branch}</option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
