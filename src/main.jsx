import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Container } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";



createRoot(document.getElementById("root")).render(
  <StrictMode>

          <App />

  </StrictMode>
);
