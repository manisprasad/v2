import { useState, useEffect } from "react";

const JsonViewer = ({ fileUrl }) => {
    const [content, setContent] = useState();

    useEffect(() => {
        const fetchJsonFile = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const json = await response.json();
                setContent(json);
            } catch (err) {
                console.error("Error fetching JSON file:", err);
            }
        };

        if (fileUrl) {
            fetchJsonFile();
        }
    }, [fileUrl]);

    const renderTable = (data) => {
        if (typeof data !== "object" || data === null) {
            return (
                <td className="cell">{String(data)}</td>
            );
        }

        if (Array.isArray(data)) {
            return (
                <table className="table">
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="cell">
                                    {renderTable(item)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        return (
            <table className="table json-viewer">
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <td className="cell header">{key}</td>
                            <td className="cell">
                                {renderTable(value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return content && renderTable(content);
};

export default JsonViewer;
