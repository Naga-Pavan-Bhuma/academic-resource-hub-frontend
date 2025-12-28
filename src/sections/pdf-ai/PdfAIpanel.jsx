import React, { useState } from "react";
import PdfSummary from "./PdfSummary";
import PdfChat from "./PdfChat";

const PdfAIpanel = ({ pdfUrl }) => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="w-full md:w-[420px] h-full bg-white border-l flex flex-col">
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === "summary"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-gray-500"
          }`}
        >
          📄 Summary
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === "chat"
              ? "border-b-2 border-emerald-500 text-emerald-600"
              : "text-gray-500"
          }`}
        >
          💬 Chat
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "summary" ? (
          <PdfSummary pdfUrl={pdfUrl} />
        ) : (
          <PdfChat pdfUrl={pdfUrl} />
        )}
      </div>
    </div>
  );
};

export default PdfAIpanel;
