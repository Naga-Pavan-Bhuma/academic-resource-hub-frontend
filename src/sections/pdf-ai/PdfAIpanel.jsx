import PdfSummary from "./PdfSummary";
import PdfChat from "./PdfChat";

const PdfAIpanel = ({ pdfUrl, activeTab }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      {activeTab === "summary" ? (
        <PdfSummary pdfUrl={pdfUrl} />
      ) : (
        <PdfChat pdfUrl={pdfUrl} />
      )}
    </div>
  );
};

export default PdfAIpanel;
