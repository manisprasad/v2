import React from "react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

import PdfViewer from "./PdfViewer";
import PngViewer from "./PngViewer";
import JpegViewer from "./JpegViewer";
import VideoViewer from "./VideoViewer";
import AudioViewer from "./AudioViewer";
import TextViewer from "./TextViewer";
import SrtViewer from "./SrtViewer";
import JsonViewer from "./JsonViewer";
import DocViewer from "./DocViewer";
import CsvViewer from "./CsvViewer";

const ContentViewer = ({ fileUrl }) => {
    const accept = {
        "application/json": [".json"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
        ],
        "application/vnd.ms-excel": [".xls", ".csv", ".xlsx"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
        "application/xml": [".xml"],
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "text/srt": [".srt"],
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
        "audio/mpeg": [".mp3"],
        "audio/wav": [".wav"],
        // "audio/ogg": [".ogg"],
        "video/mp4": [".mp4"],
        // "video/x-msvideo": [".avi"],
        "video/x-matroska": [".mkv"],
        // "video/webm": [".webm"]
    };

    const getFileType = (url) => {
        const fileNameStart = url.lastIndexOf("/") + 1;
        const fileName = url.substring(fileNameStart);
        const queryStringStart = fileName.indexOf("?");

        const actualFileName =
            queryStringStart === -1
                ? fileName
                : fileName.substring(0, queryStringStart);
        const extensionStart = actualFileName.lastIndexOf(".") + 1;
        const extension = actualFileName
            .substring(extensionStart)
            .toLowerCase();

        for (const type in accept) {
            if (accept[type].includes(`.${extension}`)) {
                return type;
            }
        }
        return null;
    };

    const type = getFileType(fileUrl);
    console.log(`File type: ${type}`);

    if (!fileUrl) {
        return (
            <div className="content-viewer">
                <div className="inner-border">
                    <p>No file selected.</p>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (type) {
            case "application/pdf":
                return (
                    <div className="inner-border">
                        <PdfViewer fileUrl={fileUrl} />
                    </div>
                );
            case "image/png":
                return (
                    <div className="inner-border">
                        <PngViewer fileUrl={fileUrl} />
                    </div>
                );
            case "image/jpeg":
                return (
                    <div className="inner-border">
                        <JpegViewer fileUrl={fileUrl} />
                    </div>
                );
            case "audio/mpeg": // .mp3
                return (
                    <div className="inner-border">
                        <AudioViewer fileUrl={fileUrl} />
                    </div>
                );

            case "audio/wav": // .wav
                return (
                    <div className="inner-border">
                        <AudioViewer fileUrl={fileUrl} />
                    </div>
                );
            case "video/x-matroska": // .mkv
                return (
                    <div className="inner-border">
                        <VideoViewer fileUrl={fileUrl} />
                    </div>
                );
            case "video/mp4":
                return (
                    <div className="inner-border">
                        <VideoViewer fileUrl={fileUrl} />
                    </div>
                );
            case "text/plain":
                return (
                    <div className="inner-border">
                        <TextViewer fileUrl={fileUrl} />
                    </div>
                );
            case "text/srt":
                return (
                    <div className="inner-border">
                        <SrtViewer fileUrl={fileUrl} />
                    </div>
                );
            case "application/json":
                return (
                    <div className="inner-border">
                        <JsonViewer fileUrl={fileUrl} />
                    </div>
                );
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return (
                    <div className="inner-border">
                        <DocViewer fileUrl={fileUrl} />
                    </div>
                );
            case "application/vnd.ms-excel": // csv, xls
                return (
                    <div className="inner-border">
                        <CsvViewer fileUrl={fileUrl} />
                    </div>
                );
            
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // xlsx
                return (
                    <div className="inner-border">
                        <CsvViewer fileUrl={fileUrl} />
                    </div>
                );
            
            default:
                return (
                    <div className="inner-border">
                        <p>File type not supported.</p>;
                    </div>
                );
        }
    };

    return <div className="content-viewer">{renderContent()}</div>;
};

export default ContentViewer;
