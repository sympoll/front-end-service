import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UpdateProvider } from "./context/UpdateContext";
import { GroupsProvider } from "./context/GroupsContext";
import { MembersProvider } from "./context/MemebersContext";
import { AuthProvider } from "./context/AuthProvider";
import { UserProvider } from "./context/UserContext";
import "./config/axiosConfig";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      {/* <AuthProvider> */}
      <UpdateProvider>
        <GroupsProvider>
          <MembersProvider>
            <App />
          </MembersProvider>
        </GroupsProvider>
      </UpdateProvider>
      {/* </AuthProvider> */}
    </UserProvider>
  </React.StrictMode>
);
