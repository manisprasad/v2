import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const CsvViewer = ({ fileUrl }) => {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCols, setSelectedCols] = useState([]);

    useEffect(() => {
        const fetchCsvFile = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const csvText = await response.text();
                Papa.parse(csvText, {
                    complete: (result) => {
                        setData(result.data);
                    },
                    header: false,
                });
            } catch (err) {
                console.error("Error fetching CSV file:", err);
            }
        };

        if (fileUrl) {
            fetchCsvFile();
        }
    }, [fileUrl]);

    // Toggle row selection
    const handleRowClick = (rowIndex) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.includes(rowIndex)) {
                return prevSelectedRows.filter((index) => index !== rowIndex);
            } else {
                return [...prevSelectedRows, rowIndex];
            }
        });
    };

    // Toggle column selection
    const handleColClick = (colIndex) => {
        setSelectedCols((prevSelectedCols) => {
            if (prevSelectedCols.includes(colIndex)) {
                return prevSelectedCols.filter((index) => index !== colIndex);
            } else {
                return [...prevSelectedCols, colIndex];
            }
        });
    };

    const cardStyle = {
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "20px",
    };

    const tableStyle = {
        borderCollapse: "collapse",
        width: "100%",
    };

    const thStyle = {
        border: "1px solid #ddd",
        padding: "8px",
        backgroundColor: "#b2b2b2", // ash color
        cursor: "pointer",
    };

    const tdStyle = {
        border: "1px solid #ddd",
        padding: "8px",
        cursor: "pointer",
    };

    // Style for selected rows and columns
    const selectedRowStyle = {
        backgroundColor: "#3A58EC",
        color: "white",
    };

    const selectedColStyle = {
        backgroundColor: "#3A58EC",
        color: "white",
    };

    return (
        <div style={cardStyle}>
            {/* <h2>Content 4: CSV Viewer</h2> */}
            {data.length > 0 && (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            {data[0].map((col, index) => (
                                <th
                                    key={index}
                                    style={{
                                        ...thStyle,
                                        ...(selectedCols.includes(index)
                                            ? selectedColStyle
                                            : {}),
                                    }}
                                    onClick={() => handleColClick(index)}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(1).map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                style={
                                    selectedRows.includes(rowIndex)
                                        ? selectedRowStyle
                                        : {}
                                }
                                onClick={() => handleRowClick(rowIndex)}>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        style={{
                                            ...tdStyle,
                                            ...(selectedRows.includes(rowIndex) ||
                                            selectedCols.includes(cellIndex)
                                                ? selectedColStyle
                                                : {}),
                                        }}>
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CsvViewer;
