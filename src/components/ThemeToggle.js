// src/components/ThemeToggle.js
import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} style={{ margin: "1rem auto", display: "block" }}>
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
}

export default ThemeToggle;
