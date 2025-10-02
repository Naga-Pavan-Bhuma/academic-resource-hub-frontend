import React from "react";
import { motion } from "framer-motion";

const FileInput = ({ file, setFile, fileError, setFileError }) => {
  return (
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
              setFileError("⚠️ File size exceeds 10 MB!");
              e.target.value = "";
              setFile(null);
              return;
            }
            setFileError("");
            setFile(selectedFile);
          }
        }}
      />
      {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
    </label>
  );
};

export default FileInput;
