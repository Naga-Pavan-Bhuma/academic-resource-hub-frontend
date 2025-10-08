import React from "react";
import FileInput from "./FileInput";
import ProgressBar from "./ProgressBar";
import UploadPreview from "./UploadPreview";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const UploadForm = ({
  user,
  file,
  setFile,
  fileError,
  setFileError,
  uploading,
  setUploading,
  uploaded,
  setUploaded,
  url,
  setUrl,
  progress,
  setProgress,
  metadata,
  setMetadata,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!file) return alert("📄 Please select a PDF to upload!");
    if (file.type !== "application/pdf") return alert("⚠️ Only PDF files are allowed!");
    if (!metadata.title || !metadata.subject) return alert("⚠️ Please fill Title & Subject!");

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
          onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
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

      setUploaded(true);
    } catch (err) {
      console.error(err);
      alert("⚠️ Upload failed! Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "flex-1 px-4 py-2 rounded-xl border border-gray-600 bg-white/20 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all";

  return (
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
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <select name="year" value={metadata.year} onChange={handleChange} className={`w-full sm:flex-1 ${inputClass}`}>
          <option value="">Select Year</option>
          {["Puc-1","Puc-2","Engg-1","Engg-2","Engg-3","Engg-4"].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select name="sem" value={metadata.sem} onChange={handleChange} className={`w-full sm:flex-1 ${inputClass}`}>
          <option value="">Select Sem</option>
          {["Sem-1","Sem-2"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="branch" value={metadata.branch} onChange={handleChange} className={`w-full sm:flex-1 ${inputClass}`}>
          <option value="">Select Branch</option>
          {["CSE","ECE","EEE","MECH","CIVIL","CHEM","MME"].map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Subject & Unit */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={metadata.subject}
          onChange={handleChange}
          className={`w-full sm:flex-1 ${inputClass}`}
        />
        <select
          name="unitNumber"
          value={metadata.unitNumber}
          onChange={handleChange}
          className={`w-full sm:max-w-[120px] ${inputClass}`}
        >
          <option value="">Unit</option>
          {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* File Input */}
      <FileInput file={file} setFile={setFile} fileError={fileError} setFileError={setFileError} />

      {/* Progress */}
      {uploading && <ProgressBar progress={progress} />}

      {/* Uploaded Preview */}
      {url && <UploadPreview url={url} user={user} />}

      {/* Upload Button */}
      {!uploaded ? (
        <motion.button
          onClick={handleUpload}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-500/80 hover:bg-cyan-400/80 hover:scale-105 transition-transform duration-300"
          } backdrop-blur-sm`}
          disabled={uploading}
          whileHover={{ scale: uploading ? 1 : 1.05 }}
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </motion.button>
      ) : (
        <motion.button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-green-500 hover:bg-green-400 hover:scale-105 transition-transform duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
        >
          Click to Upload Another PDF
        </motion.button>
      )}
    </div>
  );
};

export default UploadForm;
