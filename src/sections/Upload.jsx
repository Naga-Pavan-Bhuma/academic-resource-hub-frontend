import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Upload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(""); // error for file size
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState({
    title: "",
    subject: "",
    year: "",
    sem: "",
    unitNumber: "",
    branch: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

  const handleUpload = async () => {
    if (!file) return alert("📄 Please select a PDF to upload!");
    if (file.type !== "application/pdf") {
      return alert("⚠️ Only PDF files are allowed!");
    }
    if (!metadata.title || !metadata.subject) {
      return alert("⚠️ Please fill required fields: Title & Subject!");
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "academic_resources");
    formData.append("resource_type", "raw");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsvroldwr/raw/upload",
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      const uploadedFileUrl = res.data.secure_url;
      setUrl(uploadedFileUrl);

      await axios.post(`${API_BASE}/resources`, {
        ...metadata,
        uploadedBy: user?.name,
        collegeId: user?.collegeId,
        file: uploadedFileUrl,
        unitNumber: Number(metadata.unitNumber),
      });

      setUploaded(true); // ✅ success state
    } catch (err) {
      console.error(err);
      alert("⚠️ Upload failed! Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-white/20 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-xl p-8 rounded-3xl shadow-xl backdrop-blur-lg bg-white/30 border border-white/20 flex flex-col items-center gap-6 overflow-hidden"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-500 animate-bounce">
          Upload Your PDF Resource
        </h2>

        <div className="flex flex-col gap-4 w-full">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={metadata.title}
            onChange={handleChange}
            className={`w-full ${inputClass}`}
          />

          {/* Year, Semester & Branch */}
          <div className="flex gap-4 w-full">
            <select name="year" value={metadata.year} onChange={handleChange} className={inputClass}>
              <option value="">Select Year</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="E1">E1</option>
              <option value="E2">E2</option>
              <option value="E3">E3</option>
              <option value="E4">E4</option>
            </select>

            <select name="sem" value={metadata.sem} onChange={handleChange} className={inputClass}>
              <option value="">Select Sem</option>
              <option value="Sem-1">Sem-1</option>
              <option value="Sem-2">Sem-2</option>
            </select>

            <select name="branch" value={metadata.branch} onChange={handleChange} className={inputClass}>
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="CHEM">CHEM</option>
              <option value="MME">MME</option>
            </select>
          </div>

          {/* Subject & Unit Number */}
          <div className="flex gap-4 w-full">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={metadata.subject}
              onChange={handleChange}
              className={`${inputClass} flex-1`}
            />
            <select
              name="unitNumber"
              value={metadata.unitNumber}
              onChange={handleChange}
              className={`${inputClass} max-w-[120px]`}
            >
              <option value="">Unit</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* File input */}
          <label className="w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`border-2 border-dashed rounded-xl px-6 py-4 w-full text-center font-medium cursor-pointer transition-all duration-300 ${
                file ? "border-cyan-400 bg-white/20 text-gray-700" : "border-red-400 bg-white/10 text-red-400"
              }`}
            >
              {file ? file.name : "No PDF chosen"}
            </motion.div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  if (selectedFile.size >= 10 * 1024 * 1024) {
                    setFileError("⚠️ File size exceeds 10 MB. Please upload a smaller PDF!");
                    e.target.value = "";
                    setFile(null);
                    return;
                  }
                  setFileError(""); // clear previous error
                  setFile(selectedFile);
                }
              }}
            />
          </label>
          {/* Show file error below input */}
          {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}

          {/* Progress Bar */}
          {uploading && (
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          )}

          {url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 bg-white/30 px-4 py-2 rounded-xl shadow-md text-cyan-500 text-center break-all backdrop-blur-sm border border-white/20"
            >
              <b>Hurrah!! PDF Uploaded Successfully and got +10 points!</b>
              <br />
              <b>
                Your Current Points: <span className="text-orange-500">{user?.points + 10}</span>
              </b>
            </motion.div>
          )}

          {/* Upload Button */}
          {!uploaded ? (
            <motion.button
              onClick={handleUpload}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cyan-500/80 hover:bg-cyan-400/80 hover:scale-105 transition-transform duration-300"
              } backdrop-blur-sm`}
              disabled={uploading}
              whileHover={{ scale: uploading ? 1 : 1.05 }}
            >
              {uploading ? "Uploading..." : uploaded ? "✅ Uploaded Successfully!" : "Upload PDF"}
            </motion.button>
          ) : (
            <motion.button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-green-500 hover:bg-green-400 hover:scale-105 transition-transform duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              Click to Upload Another PDF
            </motion.button>
          )}

          {/* PDF Preview */}
          {url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 w-full"
            >
              <h3 className="text-lg font-semibold mb-2 text-cyan-500">Preview PDF:</h3>
              <iframe
                src={url}
                className="w-full h-64 border border-gray-300 rounded-xl"
                title="PDF Preview"
              ></iframe>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Upload;
