import React, { useState } from "react";
import { motion } from "framer-motion";
import UploadForm from "./UploadForm";

const Upload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
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

        <UploadForm
          user={user}
          file={file}
          setFile={setFile}
          fileError={fileError}
          setFileError={setFileError}
          uploading={uploading}
          setUploading={setUploading}
          uploaded={uploaded}
          setUploaded={setUploaded}
          url={url}
          setUrl={setUrl}
          progress={progress}
          setProgress={setProgress}
          metadata={metadata}
          setMetadata={setMetadata}
        />
      </motion.div>
    </div>
  );
};

export default Upload;
