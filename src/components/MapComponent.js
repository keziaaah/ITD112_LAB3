// src/components/MapComponent.js

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import L from "leaflet";

// ✅ Marker Icon Function Based on Cases
const getMarkerIcon = (cases) => {
  const color =
    cases > 500
      ? "red"
      : cases > 200
      ? "orange"
      : cases > 100
      ? "yellow"
      : cases > 50
      ? "green"
      : "blue";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// ✅ Static Coordinates for Key Regions
const regionCoordinates = {
  "region v-bicol region": { lat: 13.6218, lng: 123.2026 },
  "region iii-central luzon": { lat: 15.4828, lng: 120.7120 },
  "region i-ilocos region": { lat: 17.5707, lng: 120.3876 },
  "region iv-a-calabarzon": { lat: 14.1000, lng: 121.2000 },
  "region ivb-mimaropa": { lat: 9.7622, lng: 118.7353 },
  "region vii-central visayas": { lat: 10.3157, lng: 123.8854 },
  "national capital region": { lat: 14.5995, lng: 120.9842 },
  "region ii-cagayan valley": { lat: 17.6131, lng: 121.7269 },
  "region xi-davao region": { lat: 7.1907, lng: 125.4553 },
  "region xii-soccsksargen": { lat: 6.1164, lng: 124.8927 },
};

const MapComponent = () => {
  const [dengueData, setDengueData] = useState([]);

  // ✅ Fetch Data from Firebase
  useEffect(() => {
    const fetchDengueData = async () => {
      try {
        const dengueCollection = collection(db, "dengueData");
        const snapshot = await getDocs(dengueCollection);
  
        const data = snapshot.docs.map((doc) => {
          const entry = doc.data();
          console.log("🔥 Firebase Entry:", entry); // Log every Firebase entry
  
          return {
            location: entry.location?.trim() || "Unknown",
            cases: Number(entry.cases) || 0,
            deaths: Number(entry.deaths) || 0,
            date: entry.date || "N/A",
            regions: entry.region?.toLowerCase().trim() || "unknown",
          };
        });
  
        console.log("✅ Final Data Array:", data); // Log the final data array
        setDengueData(data);
      } catch (error) {
        console.error("❌ Firebase Error:", error);
      }
    };
  
    fetchDengueData();
  }, []);
  
  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      {/* ✅ Map Section */}
      <div style={{ height: "80vh", width: "70%", borderRadius: "10px", overflow: "hidden" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🦟 Dengue Cases by Region</h2>
        <MapContainer
          center={[13, 122]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* ✅ Markers Display */}
          {dengueData.map((entry, index) => {
  const regionKey = entry.regions?.toLowerCase();
  const coordinates = regionCoordinates[regionKey];

  if (coordinates) {
    return (
      <Marker
        key={index}
        position={[coordinates.lat, coordinates.lng]}
        icon={getMarkerIcon(entry.cases)}
      >
        <Popup>
          <b>{entry.location}</b><br />
          🦟 Dengue Cases: <b>{entry.cases}</b><br />
          ⚰️ Dengue Deaths: <b>{entry.deaths}</b><br />
          📅 Date: <b>{entry.date}</b><br />
          🌍 Region: <b>{entry.regions}</b>
        </Popup>
        <Tooltip>{entry.location} - Cases: {entry.cases}</Tooltip>
      </Marker>
    );
  } else {
    console.warn(`⚠️ Missing coordinates for region: ${regionKey}`);
  }

  return null;
})}

        </MapContainer>
      </div>

      {/* ✅ Sidebar Section */}
      <div
  style={{
    width: "30%",
    height: "80vh",
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
  }}
>
  <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
    📊 Dengue Cases Overview
  </h3>
  {dengueData.length > 0 ? (
    <ul style={{ listStyle: "none", padding: "0" }}>
      {dengueData.map((entry, index) => (
        <li
          key={index}
          style={{
            marginBottom: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#fff",
          }}
        >
          <strong>{entry.location}</strong><br />
          🦟 Cases: {entry.cases}<br />
          ⚰️ Deaths: {entry.deaths}<br />
          📅 Date: {entry.date}<br />
          🌍 Region: {entry.regions}
        </li>
      ))}
    </ul>
  ) : (
    <p style={{ textAlign: "center", color: "red" }}>
      ❌ No data available. Please check your database or refresh the page.
    </p>
  )}
</div>

    </div>
  );
};

export default MapComponent;
