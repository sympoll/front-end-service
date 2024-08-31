import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GroupsProvider } from "./cmps/group/GroupContext";
import { UpdateProvider } from "./context/UpdateContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UpdateProvider>
      <GroupsProvider>
        <App />
      </GroupsProvider>
    </UpdateProvider>
  </React.StrictMode>
);



