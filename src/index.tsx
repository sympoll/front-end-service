import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UpdateProvider } from "./context/UpdateContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <UpdateProvider>
    <App />
  </UpdateProvider>
);
