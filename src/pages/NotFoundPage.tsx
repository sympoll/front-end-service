import React from "react";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="not-found-page-container">
      <div className="not-found-page-title-container">
        <div className="not-found-page-title0">404</div>
        <p className="not-found-page-title1">Page Not Found</p>
      </div>

      <div className="not-found-page-content">
        <div className="not-found-page-content-item0">Hmmm...</div>

        <p className="not-found-page-content-item1">
          It looks like one of the developers fell asleep
        </p>

        <Button onClick={() => navigate("/")}>Go to Home</Button>
      </div>
    </section>
  );
}
