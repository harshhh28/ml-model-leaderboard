import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error("Failed to render app:", error);
}
