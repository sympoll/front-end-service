import "./assets/styles/main.scss";
import { BrowserRouter, Routes, Route, redirect, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ContentPage from "./pages/ContentPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import ProtectedRoute from "./cmps/route/ProtectedRoute";

export default function App() {
  return (
    // can add silent login here to auto try to sign in, and if not previously signed in within a certain time, auto redirect to the landing page
    // TODO: add reset account page
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-account" element={<NotFoundPage />} />
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
    </AuthProvider>
  );
}
