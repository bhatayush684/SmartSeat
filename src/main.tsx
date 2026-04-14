import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

console.log("SmartSeat Planner starting...");

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, rendering SmartSeat Planner...");
  createRoot(rootElement).render(<App />);
  console.log("SmartSeat Planner rendered successfully");
} else {
  console.error("Root element not found");
}
