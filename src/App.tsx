import "./assets/styles/main.scss";
import { BrowserRouter, Routes, Route, redirect, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ContentPage from "./pages/ContentPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./cmps/route/ProtectedRoute";
import KeycloakLoginPage from "./pages/KeycloakLoginPage";
import { useUser } from "./context/UserContext";
import { useEffect } from "react";

export default function App() {
  const { user } = useUser();

  return (
    // TODO: add reset account page
    <BrowserRouter>
      <Routes>
        {/* If the user is logged in, redirect to /feed; otherwise, show the landing page */}
        <Route path="/" element={user ? <Navigate to="/feed" replace /> : <LandingPage />} />

        {/* Login and Reset Account pages */}
        <Route path="/login" element={<KeycloakLoginPage />} />
        <Route path="/reset-account" element={<NotFoundPage />} />

        {/* Handle any undefined routes */}
        <Route path="/*" element={<NotFoundPage />} />

        {/* Protected routes */}
        <Route
          path="/feed/*"
          element={
            <ProtectedRoute>
              <ContentPage content="feed" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed/:groupId"
          element={
            <ProtectedRoute>
              <ContentPage content="feed" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId"
          element={
            <ProtectedRoute>
              <ContentPage content="user-profile" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId"
          element={
            <ProtectedRoute>
              <ContentPage content="group-info" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
