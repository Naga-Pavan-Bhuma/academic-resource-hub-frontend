import React, { useState } from "react";
import ReactDOM from "react-dom";
import PDFViewer from "./PDFViewer";
import PdfAIpanel from "./pdf-ai/PdfAIpanel";

const PDFViewerWrapper = (props) => {
  const [activeTab, setActiveTab] = useState("summary");

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/70">

      {/* Main container */}
      <div className="flex h-full pt-[72px]"> {/* toolbar height */}

        {/* LEFT: PDF */}
        <div className="flex-1 relative bg-black">
          <PDFViewer {...props} />
        </div>

        {/* RIGHT: AI PANEL */}
        <div className="hidden md:flex flex-col w-[420px] bg-white border-l">

          {/* 🔥 AI BUTTONS BELOW TOOLBAR */}
          <div className="flex gap-3 p-3 border-b">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold
                ${
                  activeTab === "summary"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              Summary
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold
                ${
                  activeTab === "chat"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              Chat
            </button>
          </div>

          {/* 🔽 AI CONTENT */}
          <div className="flex-1 overflow-hidden">
            <PdfAIpanel pdfUrl={props.file} activeTab={activeTab} />
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default PDFViewerWrapper;
