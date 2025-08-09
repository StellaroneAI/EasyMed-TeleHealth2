import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ABHAProvider } from "./contexts/ABHAContext";
import "./index.css";

// Import i18n configuration
import "./i18n/config";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode> - Temporarily disabled for debugging
  <ABHAProvider>
    <App />
  </ABHAProvider>,
  // </React.StrictMode>,
);
