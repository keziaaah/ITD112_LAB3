import React, { useState } from "react";
import Papa from "papaparse";

const CSVUploader = ({ onUpload }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setCsvFile(selectedFile);
      console.log("✅ CSV file selected:", selectedFile.name);
    } else {
      setCsvFile(null);
      alert("❌ Please select a valid CSV file.");
    }
  };

  const handleUpload = () => {
    if (!csvFile) {
      alert("❌ Please select a CSV file first.");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("✅ Parsed CSV Data:", result.data);
        onUpload(result.data); // Pass parsed data to parent component
        alert("✅ CSV uploaded and parsed successfully!");
      },
      error: (error) => {
        console.error("❌ Error parsing CSV:", error.message);
        alert("❌ Failed to parse CSV file. Check console for errors.");
      },
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "#007BFF",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Upload CSV
      </button>
    </div>
  );
};

export default CSVUploader;
