// src/App.js

import React, { useState } from "react";
import DengueDataList from "./components/DengueDataList";
import MapComponent from "./components/MapComponent";
import ComparisonGraph from "./components/ComparisonGraph";
import DistributionGraph from "./components/DistributionGraph";
import RelationshipGraph from "./components/RelationshipGraph";
import CompositionGraph from "./components/CompositionGraph";
import CSVUploader from "./components/CSVUploader";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import CsvUploadFirebase from "./components/CsvUploadFirebase";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [uploadedData, setUploadedData] = useState([]); // Stores CSV Data
  const [showModal, setShowModal] = useState(false); // Controls CSV Modal Visibility

  /**
   * ✅ Handle CSV Upload Data
   */
  const handleCSVUpload = (data) => {
    if (data && data.length > 0) {
      const normalizedData = data.map((row) => ({
        location: row["loc"] || row["#adm2+name"] || "Unknown",
        cases: parseInt(row["cases"] || row["#affected+infected"] || 0, 10),
        deaths: parseInt(row["deaths"] || row["#affected+killed"] || 0, 10),
        date: row["date"] || row["#date"] || "Unknown",
        region: row["region"] || row["#region"] || "Unknown",
        year: row["year"] || row["#year"] || "Unknown",
      }));
  
      console.log("✅ Parsed CSV Data:", normalizedData);
      setUploadedData(normalizedData);
      alert("✅ CSV Data Loaded Successfully!");
    } else {
      alert("❌ CSV file is empty or improperly formatted.");
    }
    setShowModal(false);
  };
  

  return (
    <ThemeProvider>
      <div className="app-container">
        {/* ✅ Header */}
        <header className="app-header">
          <h1>🦟 Dengue Data Monitoring Dashboard</h1>
          <ThemeToggle />
          <button onClick={() => setShowModal(true)} className="btn-primary">
            📤 Load Data from CSV
          </button>
        </header>

        {/* ✅ CSV Upload Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Upload CSV Data</h2>
              <CSVUploader onUpload={handleCSVUpload} />
              <button onClick={() => setShowModal(false)} className="btn-danger">
                ❌ Close
              </button>
            </div>
          </div>
        )}

        {/* ✅ Dengue Data List */}
        <section className="section">
          <h2>📊 Dengue Data List</h2>
          <DengueDataList uploadedData={uploadedData} />
        </section>

        {/* ✅ Data Visualization */}
        <section className="section">
          <h2>📈 Data Visualization</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>📊 Comparison Graph</h3>
              <ComparisonGraph data={uploadedData} />
            </div>
            <div className="chart-card">
              <h3>📍 Distribution Graph</h3>
              <DistributionGraph data={uploadedData} />
            </div>
            
            <div className="chart-card">
              <h3>📊 Composition Graph</h3>
              <CompositionGraph data={uploadedData} />
            </div>
          </div>
        </section>

        {/* ✅ Map Section */}
        <section className="section">
          <h2>🗺️ Geographical Representation</h2>
          <MapComponent uploadedData={uploadedData} />
        </section>

        {/* ✅ Footer */}
        <footer className="app-footer">
          <p>© 2024 Dengue Dashboard. All Rights Reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
