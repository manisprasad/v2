import React, { useEffect, useState } from "react";

const SrtViewer = ({ fileUrl }) => {
    const [content, setContent] = useState();
    useEffect(() => {
        const fetchSrtFile = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const json = await response.text();
                setContent(json);
            } catch (err) {
                console.error("Error fetching JSON file:", err);
            }
        };

        if (fileUrl) {
            fetchSrtFile();
        }
    }, [fileUrl]);

    const parseSrt = (content) => {
        // return "hello world";
        const lines = content.split("\n");
        const parsedLines = [];
        let currentTimestamp = "";

        lines.forEach((line, index) => {
            if (line.includes("-->")) {
                // It's a timestamp
                currentTimestamp = line; // Save the current timestamp for display
                parsedLines.push(
                    <div key={index} className="font-bold">
                        {line}
                    </div>
                );
            } else if (!isNaN(Number(line))) {
                // It's a sequence number, so ignore or handle accordingly
                parsedLines.push(
                    <div key={index} className="text-gray-500">
                        {line}
                    </div>
                );
            } else {
                // It's dialogue or text content
                if (currentTimestamp) {
                    parsedLines.push(
                        <div key={index} className="mt-2">
                            {/* <span className="font-bold">
                                {currentTimestamp}
                            </span> */}
                            {/* :  */}
                            {line}
                        </div>
                    );
                    currentTimestamp = ""; // Reset timestamp after using it
                }
            }
        });
        return parsedLines;
    };

    return content ? parseSrt(content) : <p>Loading...</p>;
};

export default SrtViewer;
