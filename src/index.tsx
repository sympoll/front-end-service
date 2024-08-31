import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GroupsProvider } from "./cmps/group/GroupContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GroupsProvider>
      <App />
    </GroupsProvider>
  </React.StrictMode>
);



