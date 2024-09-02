import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UpdateProvider } from "./context/UpdateContext";
import { GroupsProvider } from "./context/GroupsContext";
import { MembersProvider } from "./context/MemebersContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UpdateProvider>
      <GroupsProvider>
        <MembersProvider>
          <App />
        </MembersProvider>
      </GroupsProvider>
    </UpdateProvider>
  </React.StrictMode>
);



