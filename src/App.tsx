import "./assets/styles/main.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import FeedPage from "./pages/FeedPage";

export default function App() {
  return (
    // can add silent login here to auto try to sign in, and if not previously signed in within a certain time, auto redirect to the landing page
    <BrowserRouter>
      <Routes>
        <Route path="/*" element="LandingPage" />
        <Route path="/login" element="LogInPage" />
        <Route path="/feed" element="FeedPage" />
        <Route path="/feeds" element="FeedPage" />
      </Routes>
    </BrowserRouter>
  );
}
