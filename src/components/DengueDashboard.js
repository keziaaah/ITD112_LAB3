import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Papa from "papaparse";
import "chart.js/auto";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

const DengueDashboard = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredRegion, setFilteredRegion] = useState("All");

  /**
   * ✅ Load and Parse Dengue Data
   */
  useEffect(() => {
    Papa.parse("/data/dengueData.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const parsedData = result.data.map((row) => ({
          location: row.loc || row.location,
          cases: parseInt(row.cases) || 0,
          deaths: parseInt(row.deaths) || 0,
          date: row.date,
          regions: row.region || row.regions,
        }));
        setDengueData(parsedData);
      },
      error: (err) => console.error("CSV Parsing Error:", err),
    });
  }, []);

  /**
   * ✅ Filtered Data
   */
  const filteredData =
    filteredRegion === "All"
      ? dengueData
      : dengueData.filter((row) => row.regions === filteredRegion);

  /**
   * ✅ Aggregate Data
   */
  const aggregateData = (groupByField, valueField) => {
    const uniqueKeys = [...new Set(filteredData.map((item) => item[groupByField]))];
    return uniqueKeys.map((key) =>
      filteredData.reduce(
        (sum, item) =>
          item[groupByField] === key ? sum + parseInt(item[valueField] || 0) : sum,
        0
      )
    );
  };

  // Prepare Chart Data
  const regions = [...new Set(filteredData.map((item) => item.regions))];
  const casesByRegion = aggregateData("regions", "cases");

  const distributionData = {
    labels: regions,
    datasets: [
      {
        label: "Dengue Cases by Region",
        data: casesByRegion,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const deathsByRegion = aggregateData("regions", "deaths");

  const pieData = {
    labels: regions,
    datasets: [
      {
        data: deathsByRegion,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dengue Dashboard</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <label htmlFor="region">Filter by Region:</label>
        <select
          id="region"
          value={filteredRegion}
          onChange={(e) => setFilteredRegion(e.target.value)}
        >
          <option value="All">All</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Dengue Cases Distribution</h3>
          <Bar data={distributionData} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>Dengue Deaths Composition</h3>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <h3>Dengue Cases Map</h3>
        <MapContainer center={[13, 122]} zoom={5} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredData.map((item, index) => (
            <CircleMarker
              key={index}
              center={[parseFloat(item.lat) || 0, parseFloat(item.lon) || 0]}
              radius={Math.sqrt(item.cases) || 5}
              fillOpacity={0.6}
              color={item.cases > 100 ? "red" : "blue"}
            >
              <Popup>
                <strong>{item.location}</strong>
                <br />
                Cases: {item.cases}
                <br />
                Deaths: {item.deaths}
                <br />
                Date: {item.date}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DengueDashboard;
