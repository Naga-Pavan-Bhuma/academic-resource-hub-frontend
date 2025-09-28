import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaUndo,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";

// Vite-compatible worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).href;

const PDFViewer = ({ file, onClose }) => {
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageCanvases = useRef([]);

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      const pdf = await pdfjsLib.getDocument(file).promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
    };
    loadPDF();
  }, [file]);

  // Render single page
  const renderPage = async (pageNum) => {
    if (!pdfDoc) return;
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale, rotation: rotate });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.className = "mb-4 shadow-lg rounded-lg";

    const context = canvas.getContext("2d");
    await page.render({ canvasContext: context, viewport }).promise;

    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";

    pageCanvases.current[pageNum - 1] = { canvas, offsetTop: 0 };

    return canvas;
  };

  // Render all pages
  useEffect(() => {
    const renderAllPages = async () => {
      if (!pdfDoc || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      pageCanvases.current = [];
      for (let i = 1; i <= numPages; i++) {
        const canvas = await renderPage(i);
        containerRef.current.appendChild(canvas);
      }

      // Calculate offsetTop for each canvas
      pageCanvases.current.forEach((p) => {
        p.offsetTop = p.canvas.offsetTop;
      });

      setCurrentPage(1); // Reset page counter
    };
    renderAllPages();
  }, [pdfDoc, scale, rotate, numPages]);

  // Scroll to page
  const scrollToPage = (pageNum) => {
    const pageObj = pageCanvases.current[pageNum - 1];
    if (pageObj && containerRef.current) {
      containerRef.current.scrollTo({ top: pageObj.offsetTop, behavior: "smooth" });
      setCurrentPage(pageNum);
    }
  };

  // Prev / Next
  const prevPage = () => {
    if (currentPage > 1) scrollToPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < numPages) scrollToPage(currentPage + 1);
  };

  // Update current page on manual scroll
  const handleScroll = () => {
    const scrollTop = containerRef.current.scrollTop;
    for (let i = 0; i < pageCanvases.current.length; i++) {
      const page = pageCanvases.current[i];
      if (
        scrollTop >= page.offsetTop - page.canvas.height / 2 &&
        scrollTop < page.offsetTop + page.canvas.height / 2
      ) {
        setCurrentPage(i + 1);
        break;
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      else if (e.key === "ArrowLeft") prevPage();
      else if (e.key === "+") setScale((s) => s + 0.2);
      else if (e.key === "-") setScale((s) => Math.max(s - 0.2, 0.2));
      else if (e.key === "r") setRotate((r) => (r + 90) % 360);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage, scale, rotate, onClose]);

  // Download PDF
  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop() || "document.pdf";
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
      {/* Toolbar */}
      <div className="bg-white w-full flex items-center justify-between px-4 py-2 shadow-md flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => s + 0.2)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaPlus />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.2))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaMinus />
          </button>
          <button
            onClick={() => setRotate((r) => (r + 90) % 360)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaUndo />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
          >
            <FaArrowLeft /> Prev
          </button>
          <span className="px-2">{currentPage} / {numPages}</span>
          <button
            onClick={nextPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
          >
            Next <FaArrowRight />
          </button>
          <button
            onClick={downloadPDF}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
          >
            <FaDownload /> Download
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaTimes />
        </button>
      </div>

      {/* PDF Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto bg-gray-100 p-6 flex flex-col items-center"
      ></div>
    </div>
  );
};

export default PDFViewer;
