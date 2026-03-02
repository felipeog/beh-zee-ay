import "./index.css";
import { App } from "./App.tsx";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

createRoot(document.querySelector("body")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
