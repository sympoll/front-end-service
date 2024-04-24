import "./assets/styles/main.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element="LandingPage" />
        <Route path="/login" element="LoginPage" />
        <Route path="/feed" element="FeedPage" />
      </Routes>
    </BrowserRouter>
  );
}
