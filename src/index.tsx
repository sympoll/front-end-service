import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UpdateProvider } from "./context/UpdateContext";
import { GroupsProvider } from "./context/GroupContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UpdateProvider>
      <GroupsProvider>
        <App />
      </GroupsProvider>
    </UpdateProvider>
  </React.StrictMode>
);



