import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { AffiliationsProvider } from "./app/providers/AffiliationsProvider";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AffiliationsProvider>
        <App />
      </AffiliationsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
