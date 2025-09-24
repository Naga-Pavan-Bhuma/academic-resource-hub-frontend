import React, { useState } from "react";

const resources = [
  { title: "DBMS Notes", subject: "Database", author: "Arjun", year: "3", sem: "2" },
  { title: "CN Previous Year Notes", subject: "Computer Networks", author: "Meena", year: "3", sem: "1" },
  { title: "Data Structures PDF", subject: "DSA", author: "Tejaswi", year: "2", sem: "2" },
  { title: "Operating Systems Slides", subject: "OS", author: "Rahul", year: "3", sem: "1" },
  { title: "Java Programming Guide", subject: "Java", author: "Sneha", year: "2", sem: "1" },
  { title: "Python Machine Learning", subject: "Python", author: "Kiran", year: "4", sem: "2" },
];

const years = ["1", "2", "3", "4"];
const semesters = ["1", "2"];

const ResourceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  const filteredResources = resources.filter(
    (res) =>
      (res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       res.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
       res.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedYear ? res.year === selectedYear : true) &&
      (selectedSem ? res.sem === selectedSem : true)
  );

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Search Resources</h2>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by subject, topic, or keyword..."
          className="flex-1 p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          className="p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-2">
        {filteredResources.length > 0 ? (
          filteredResources.map((res, index) => (
            <li
              key={index}
              className="p-3 bg-white rounded-md shadow hover:bg-cyan-50 transition flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{res.title}</p>
                <p className="text-sm text-gray-500">
                  {res.subject} • by {res.author} • Year {res.year}, Sem {res.sem}
                </p>
              </div>
              <button className="px-3 py-1 text-sm text-white bg-cyan-600 rounded hover:bg-cyan-700 transition">
                Download
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No resources found.</p>
        )}
      </ul>
    </section>
  );
};

export default ResourceSearch;
