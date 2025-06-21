import React, { useState, useEffect } from "react";
import mammoth from "mammoth";
import JSZip from "jszip";

const DocViewer = ({ fileUrl }) => {
    const [docContent, setDocContent] = useState("");

    useEffect(() => {
        const fetchDocFile = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                // Use blob to handle the fetch
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                await processDoc(arrayBuffer);
            } catch (err) {
                console.error("Error fetching document file:", err);
            }
        };

        if (fileUrl) {
            fetchDocFile();
        }
    }, [fileUrl]);

    const processDoc = async (arrayBuffer) => {
        try {
            // Convert the DOCX to HTML
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setDocContent(result.value);

            // Extract images
            const zip = await JSZip.loadAsync(arrayBuffer);
            const imgPromises = [];
            zip.forEach((relativePath, file) => {
                if (file.name.match(/(jpg|jpeg|png|gif)$/)) {
                    imgPromises.push(
                        file.async("base64").then((data) => {
                            // Create an image src
                            return `data:${file.name.split(".").pop()};base64,${data}`;
                        })
                    );
                }
            });

            const imgSrcs = await Promise.all(imgPromises);
            const imgElements = imgSrcs.map(
                (src) => `<img src="${src}" style="max-width: 100%;" />`
            );
            setDocContent((prevContent) => prevContent + imgElements.join(""));
        } catch (err) {
            console.error("Error processing document:", err);
        }
    };

    return (
        <div className="mt-4">
            {docContent ? (
                <>
                    <h2 className="text-lg font-bold mb-2">Document Content:</h2>
                    <div
                        className="p-4 bg-gray-100 rounded"
                        dangerouslySetInnerHTML={{ __html: docContent }}
                    />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default DocViewer;
