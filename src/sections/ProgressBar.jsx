import React from "react";

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-300 rounded-full h-3">
    <div className="bg-cyan-500 h-3 rounded-full" style={{ width: `${progress}%` }} />
  </div>
);

export default ProgressBar;
