import React, { useState } from "react";
import { FaBook, FaEye } from "react-icons/fa";
import PDFViewer from "./PDFViewer";

const resources = [
  { id: "R001", title: "DBMS Notes", subject: "Database", uploadedBy: "Arjun", year: "3", sem: "2", file: "/SVM.pdf" },
  { id: "R002", title: "CN Previous Year Notes", subject: "Computer Networks", uploadedBy: "Meena", year: "3", sem: "1", file: "/pdfs/cn.pdf" },
  { id: "R003", title: "Data Structures PDF", subject: "DSA", uploadedBy: "Tejaswi", year: "2", sem: "2", file: "/pdfs/dsa.pdf" },
  { id: "R004", title: "Operating Systems Slides", subject: "OS", uploadedBy: "Rahul", year: "3", sem: "1", file: "/pdfs/os.pdf" },
  { id: "R005", title: "Java Programming Guide", subject: "Java", uploadedBy: "Sneha", year: "2", sem: "1", file: "/pdfs/java.pdf" },
  { id: "R006", title: "Python Machine Learning", subject: "Python", uploadedBy: "Kiran", year: "4", sem: "2", file: "/pdfs/python.pdf" },
];

const years = ["P1", "P2", "E1", "E2", "E3", "E4"];
const semesters = ["Sem 1", "Sem 2"]

const ResourceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [viewPdf, setViewPdf] = useState(null);

  const filteredResources = resources.filter(
    (res) =>
      (res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedYear ? res.year === selectedYear : true) &&
      (selectedSem ? res.sem === selectedSem : true)
  );

  return (
    <section className="p-6 min-h-screen bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-cyan-700 mb-8 text-center">
        📚 Discover Your Resources
      </h2>

      {/* Filters */}
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
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
        <select
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
          className="p-3 rounded-full border border-white/50 bg-white/20 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">Semester</option>
          {semesters.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
        </select>
      </div>

      {/* Resource Cards */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div key={res.id} className="bg-white/20 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/30 hover:scale-105 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FaBook className="text-cyan-400 text-2xl" />
                <h3 className="font-semibold text-lg text-gray-900">{res.title}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">Uploaded by <span className="font-medium">{res.uploadedBy}</span></p>
              <p className="text-sm text-gray-700 mb-4">ID: <span className="font-medium">{res.id}</span></p>
              <div className="flex gap-2 flex-wrap mb-5">
                <span className="bg-cyan-100/40 text-cyan-800 text-xs px-3 py-1 rounded-full">{res.subject}</span>
                <span className="bg-purple-100/40 text-purple-800 text-xs px-3 py-1 rounded-full">Year {res.year}</span>
                <span className="bg-pink-100/40 text-pink-800 text-xs px-3 py-1 rounded-full">Sem {res.sem}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewPdf(res.file)} className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-white py-2 rounded-2xl hover:bg-cyan-600 hover:scale-105 transition"><FaEye /> View PDF</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-center text-gray-600 font-medium mt-10">😔 No resources found!</p>}

      {/* PDF Modal */}
      {viewPdf && <PDFViewer file={viewPdf} onClose={() => setViewPdf(null)} />}
    </section>
  );
};

export default ResourceSearch;
