// src/index.js
import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";

 // Case-sensitive, ensure it's exactly 'App'
import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
