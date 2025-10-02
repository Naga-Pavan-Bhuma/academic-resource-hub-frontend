import ReactDOM from "react-dom";
import PDFViewer from "./PDFViewer";
const PDFViewerWrapper = (props) => {
  return ReactDOM.createPortal(
    <PDFViewer {...props} />,
    document.body
  );
};

export default PDFViewerWrapper;
