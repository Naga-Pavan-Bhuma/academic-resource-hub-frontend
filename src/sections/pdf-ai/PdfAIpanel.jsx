import PdfSummary from "./PdfSummary";
import PdfChat from "./PdfChat";
import PdfQuiz from "./PdfQuiz"; // ✅ add this

const PdfAIpanel = ({ pdfUrl, activeTab }) => {
  return (
    <div className="h-full bg-white flex flex-col">

      {activeTab === "summary" && (
        <PdfSummary pdfUrl={pdfUrl} />
      )}

      {activeTab === "chat" && (
        <PdfChat pdfUrl={pdfUrl} />
      )}

      {activeTab === "quiz" && (
        <PdfQuiz pdfUrl={pdfUrl} />
      )}

    </div>
  );
};

export default PdfAIpanel;
