import React from "react";
import Button from "../cmps/global/Button";
import { Link, useNavigate } from "react-router-dom";

export default function LogInPage() {
  const navigate = useNavigate();

  return (
    <section className="login-page-container">
      <p className="login-page-title">Login to Sympoll™</p>
      <div className="login-page-buttons">
        <Button onClick={() => navigate("/login")}>Sign In</Button>
        <p className="login-page-forgot-account">
          <Link to="/reset-account">Forgot Username / Password?</Link>
        </p>
        <p className="login-page-no-account">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
