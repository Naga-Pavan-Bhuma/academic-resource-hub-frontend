import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import PDFToolbar from "./PDFToolbar";
import PDFContainer from "./PDFContainer";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

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
  const [loading, setLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [user, setUser] = useState(undefined);
  const [resourceId, setResourceId] = useState(null); // ✅ fetched resourceId
  const pageCanvases = useRef([]);
  const [blobUrl, setBlobUrl] = useState(null);
  const [downloadCount, setDownloadCount] = useState(0);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setUser(null);

        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch resource ID based on file URL
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/resources?file=${encodeURIComponent(file)}`
        );
        if (res.data.length > 0) setResourceId(res.data[0]._id);
      } catch (err) {
        console.error("Failed to fetch resource ID:", err);
      }
    };
    fetchResource();
  }, [file]);

  // Load PDF
  useEffect(() => {
    const loadPDF = async () => {
      setLoading(true);
      setLoadingPercent(0);
      if (containerRef.current) containerRef.current.scrollTop = 0;

      try {
        const response = await axios.get(file, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);
        setBlobUrl(url);

        const pdf = await pdfjsLib.getDocument(url).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [file]);
  // Fetch download count
  useEffect(() => {
    if (!resourceId) return;
    const fetchDownloads = async () => {
      try {
        const res = await axios.get(`${API_BASE}/resources/${resourceId}`);
        setDownloadCount(res.data.downloads || 0);
      } catch (err) {
        console.error("Failed to fetch download count:", err);
      }
    };
    fetchDownloads();
  }, [resourceId]);
  const scrollToPage = (pageNum) => {
    const pageObj = pageCanvases.current[pageNum - 1];
    if (pageObj && containerRef.current) {
      containerRef.current.scrollTo({
        top: pageObj.offsetTop,
        behavior: "smooth",
      });
      setCurrentPage(pageNum);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) scrollToPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < numPages) scrollToPage(currentPage + 1);
  };

  const downloadPDF = async () => {
    if (!blobUrl || !resourceId) return;

    // 🔥 Increment download count in backend
    try {
      await axios.patch(`${API_BASE}/resources/${resourceId}/download`);
    } catch (err) {
      console.error("Error incrementing download count:", err);
    }
    await axios.patch(`${API_BASE}/resources/${resourceId}/download`);
    setDownloadCount((prev) => prev + 1);

    // 💾 Then trigger the actual download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = file.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (user === undefined) return <div>Loading user...</div>;
  if (user === null) return <div>⚠️ Not logged in</div>;
  if (!resourceId) return <div>Loading resource info...</div>;

  return (
  <div className="flex flex-col h-full w-full bg-black/70">
    <PDFToolbar
      scale={scale}
      setScale={setScale}
      rotate={rotate}
      setRotate={setRotate}
      currentPage={currentPage}
      numPages={numPages}
      prevPage={prevPage}
      nextPage={nextPage}
      downloadPDF={downloadPDF}
      onClose={onClose}
      resourceId={resourceId}
      userId={user._id}
      downloadCount={downloadCount}
    />

    <PDFContainer
      containerRef={containerRef}
      pdfDoc={pdfDoc}
      scale={scale}
      rotate={rotate}
      pageCanvases={pageCanvases}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      loading={loading}
      loadingPercent={loadingPercent}
    />
  </div>
);

};

export default PDFViewer;
