import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

const PdfViewer = ({ fileUrl }) => {
    // Initialize the zoom plugin for PDFs

    const zoomPluginInstance = zoomPlugin();
    const { ZoomIn, ZoomOut, ZoomPopover } = zoomPluginInstance;

    const handleScrollZoom = (event) => {
        if (event.deltaY < 0) {
            zoomPluginInstance.ZoomIn();
        } else if (event.deltaY > 0) {
            zoomPluginInstance.ZoomOut();
        }
    };

    return (
        <div className="pdf-container w-full h-full flex flex-col">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <div className="pdf-toolbar flex items-center justify-end p-2 bg-gray-100">
                    <ZoomOut />
                    <ZoomPopover />
                    <ZoomIn />
                </div>
                <div className="pdf-viewer-container flex-grow overflow-auto">
                    <Viewer
                        fileUrl={fileUrl}
                        plugins={[zoomPluginInstance]}
                        defaultScale={SpecialZoomLevel.PageWidth}
                        onWheel={handleScrollZoom}
                        className="pdfViewer"
                    />
                </div>
            </Worker>
        </div>
    );
};

export default PdfViewer;
