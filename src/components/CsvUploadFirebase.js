// src/components/CsvUploadFirebase.js

import React, { useState } from "react";
import Papa from "papaparse";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const CsvUploadFirebase = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  /**
   * ✅ Handle CSV Upload
   */
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please upload a CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("✅ Parsed CSV Data:", result.data);
        setCsvData(result.data);
      },
      error: (error) => {
        console.error("❌ CSV Parsing Error:", error.message);
        alert("Error parsing CSV file. Please check the file format.");
      },
    });
  };

  /**
   * ✅ Upload Data to Firebase
   */
  const uploadDataToFirebase = async () => {
    if (csvData.length === 0) {
      alert("No data to upload. Please upload a valid CSV file.");
      return;
    }

    try {
      const dengueCollection = collection(db, "dengueData");

      for (const row of csvData) {
        await addDoc(dengueCollection, {
          location: row["location"]?.trim() || row["loc"]?.trim() || "Unknown",
          cases: Number(row["cases"]) || 0,
          deaths: Number(row["deaths"]) || 0,
          date: row["date"] || "N/A",
          region: row["region"]?.toLowerCase().trim() || row["regions"]?.toLowerCase().trim() || "unknown",
        });
      }

      setUploadStatus("✅ CSV data uploaded successfully!");
      console.log("✅ Data successfully uploaded to Firebase.");
    } catch (error) {
      console.error("❌ Error uploading data to Firebase:", error);
      setUploadStatus("❌ Failed to upload data. Check console logs for details.");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h2>📤 CSV Upload to Firebase</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        style={{ marginBottom: "1rem" }}
      />
      <button
        onClick={uploadDataToFirebase}
        style={{
          padding: "0.5rem 1rem",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload to Firebase
      </button>
      {uploadStatus && <p style={{ marginTop: "1rem" }}>{uploadStatus}</p>}
    </div>
  );
};

export default CsvUploadFirebase;
