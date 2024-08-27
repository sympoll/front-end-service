import "./assets/styles/main.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ContentPage from "./pages/ContentPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    // can add silent login here to auto try to sign in, and if not previously signed in within a certain time, auto redirect to the landing page
    // TODO: add reset accound page
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-account" element={<NotFoundPage />} />

        <Route path="/feed/*" element={<ContentPage content="feed" />} />
        <Route path="/feed/:groupId" element={<ContentPage content="feed" />} />
        <Route path="/:userId" element={<ContentPage content="user-profile" />} />
      </Routes>
    </BrowserRouter>
  );
}
