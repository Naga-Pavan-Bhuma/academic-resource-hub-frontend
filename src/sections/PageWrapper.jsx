import React from "react";

const PageWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen pt-24 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse z-0"></div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PageWrapper;
