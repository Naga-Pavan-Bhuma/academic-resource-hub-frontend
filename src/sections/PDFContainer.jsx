import React, { useEffect } from "react";

const PDFContainer = ({
  containerRef, pdfDoc, scale, rotate,
  pageCanvases, currentPage, setCurrentPage,
  loading, loadingPercent
}) => {
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

  useEffect(() => {
    const renderAllPages = async () => {
      if (!pdfDoc || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      pageCanvases.current = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const canvas = await renderPage(i);
        containerRef.current.appendChild(canvas);
      }
      pageCanvases.current.forEach(p => p.offsetTop = p.canvas.offsetTop);
      setCurrentPage(1);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    };
    renderAllPages();
  }, [pdfDoc, scale, rotate]);

  const handleScroll = () => {
    const scrollTop = containerRef.current.scrollTop;
    for (let i = 0; i < pageCanvases.current.length; i++) {
      const page = pageCanvases.current[i];
      if (scrollTop >= page.offsetTop - page.canvas.height / 2 &&
          scrollTop < page.offsetTop + page.canvas.height / 2) {
        setCurrentPage(i + 1);
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 w-full overflow-y-auto bg-gray-100 p-6 flex flex-col items-center relative"
    >
      {loading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-gray-700 font-semibold z-[9999]">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent border-b-transparent rounded-full animate-spin mb-2"></div>
          Loading PDF... {loadingPercent}%
        </div>
      )}
    </div>
  );
};

export default PDFContainer;
