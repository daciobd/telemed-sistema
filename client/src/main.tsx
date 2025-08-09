import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Debug: Log to confirm script is loading
console.log("🔄 React app starting...");

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("✅ Root element found, mounting React app");
  createRoot(rootElement).render(<App />);
} else {
  console.error("❌ Root element not found!");
}
