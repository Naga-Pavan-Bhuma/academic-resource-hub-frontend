import ReactDOM from "react-dom";
import PDFViewer from "./PDFViewer";
import PdfAIpanel from "./pdf-ai/PdfAIpanel";

const PDFViewerWrapper = (props) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex bg-black/70">
      
      {/* PDF Viewer Section */}
      <div className="flex-1 relative">
        <PDFViewer {...props} />
      </div>

      {/* AI Panel Section */}
      <div className="w-[420px] hidden md:block bg-white">
        <PdfAIpanel pdfUrl={props.file} />
      </div>

    </div>,
    document.body
  );
};

export default PDFViewerWrapper;
