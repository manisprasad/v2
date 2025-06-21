import React, { useEffect, useState } from "react";

const TextViewer = ({ fileUrl }) => {
    const [content, setContent] = useState();

    useEffect(() => {
        const fetchTextFile = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const text = await response.text();
                setContent(text);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTextFile();
    }, [fileUrl]);

    return content ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
    ) : (
        <p>loading...</p>
    );
};

export default TextViewer;
