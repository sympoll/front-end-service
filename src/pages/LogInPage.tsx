import React, { useState } from "react";
import Button from "../cmps/global/Button";
import { Link, useNavigate } from "react-router-dom";

export default function LogInPage() {
  const [isSignIn, setIsSignIn] = useState(true); // true = sign in mode, false = sign up mode
  const navigate = useNavigate();

  const handleModeToggle = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignIn = (event: React.FormEvent) => {
    // Add login logic
  };

  const handleSignUp = (event: React.FormEvent) => {
    // Add sign up logic
  };

  return (
    <section className="login-page-container">
      <div className="login-form-container">
        <form
          className="login-form"
          onSubmit={isSignIn ? handleSignUp : handleSignIn}
        >
          <p className="login-form-title">
            {isSignIn ? "Sign Up" : "Log In"} to Sympoll™
          </p>
          <button
            type="submit"
            onClick={isSignIn ? handleSignUp : handleSignIn}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="login-form-forgot-info">
          <p>
            <Link to="/reset-account">Forgot Username / Password?</Link>
          </p>
          <p>
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <Link to="" onClick={handleModeToggle}>
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
