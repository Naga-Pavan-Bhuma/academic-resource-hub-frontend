import React from "react";
import { motion } from "framer-motion";

const UploadPreview = ({ url, user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mt-4 w-full"
  >
    <h3 className="text-lg font-semibold mb-2 text-cyan-500">Preview PDF:</h3>
    <iframe src={url} className="w-full h-64 border border-gray-300 rounded-xl" title="PDF Preview"></iframe>
    <div className="mt-2 bg-white/30 px-4 py-2 rounded-xl shadow-md text-cyan-500 text-center break-all backdrop-blur-sm border border-white/20">
      <b>Hurrah!! PDF Uploaded Successfully and got +10 points!</b>
      <br />
      <b>
        Your Current Points: <span className="text-orange-500">{user?.points + 10}</span>
      </b>
    </div>
  </motion.div>
);

export default UploadPreview;
