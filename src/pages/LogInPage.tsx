import React from "react";
import Button from "../cmps/global/Button";
import { useNavigate } from "react-router-dom";

export default function LogInPage() {
  const navigate = useNavigate();

  return (
    <section className="login-page-container">
      <p className="login-page-title">Login to Sympoll™</p>
      <div className="login-page-buttons">
        <Button onClick={() => navigate("/login")}>Log In</Button>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    </section>
  );
}
