import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SPACE = " ";
const EMPTY_STR = "";
const MAX_PASS_LEN = 20;
const MAX_USERNAME_LEN = 20;
const MAX_EMAIL_LEN = 20;

export default function LogInPage() {
  const [isSignIn, setIsSignIn] = useState(true); // true = log in mode, false = sign up mode
  const [username, setUsername] = useState(EMPTY_STR);
  const [email, setEmail] = useState(EMPTY_STR);
  const [password, setPassword] = useState(EMPTY_STR);
  const [passwordConfirm, setPasswordConfirm] = useState(EMPTY_STR);
  const navigate = useNavigate();

  const handleModeToggle = () => {
    setIsSignIn(!isSignIn);
  };

  const handleLogIn = (event: React.FormEvent) => {
    // Add login logic
  };

  const handleSignUp = (event: React.FormEvent) => {
    // Add sign up logic
  };

  const preventSpaceKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === SPACE) event.preventDefault();
  };

  return (
    <section className="login-page-container">
      <div className="login-form-container">
        <p className="login-form-title">
          {isSignIn ? "Log In" : "Sign Up"} to Sympoll™
        </p>
        <form
          className="login-form"
          onSubmit={isSignIn ? handleLogIn : handleSignUp}
        >
          <input
            type="text"
            onKeyDown={preventSpaceKeyPress}
            maxLength={MAX_USERNAME_LEN}
            placeholder="Username..."
            value={username}
            onChange={(event: any) => {
              if (event.nativeEvent.keyCode === 32) event.preventDefault();
              else setUsername(event.target.value);
            }}
          />
          {!isSignIn && (
            <input
              type="text"
              onKeyDown={preventSpaceKeyPress}
              maxLength={MAX_EMAIL_LEN}
              placeholder="Email..."
              value={email}
              onChange={(event: any) => {
                if (event.nativeEvent.keyCode === 32) event.preventDefault();
                else setEmail(event.target.value);
              }}
            />
          )}
          <input
            type="password"
            onKeyDown={preventSpaceKeyPress}
            maxLength={MAX_PASS_LEN}
            placeholder="Password..."
            value={password}
            onChange={(event: any) => {
              setPassword(event.target.value);
            }}
          />
          {!isSignIn && (
            <input
              type="password"
              onKeyDown={preventSpaceKeyPress}
              maxLength={MAX_PASS_LEN}
              placeholder="Confirm Password..."
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
              }}
            />
          )}

          <button type="submit">{isSignIn ? "Log In" : "Sign Up"}</button>
        </form>
        <div className="login-form-forgot-info">
          <p>
            <Link to="/reset-account">Forgot Username / Password?</Link>
          </p>
          <p>
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <Link to="" onClick={handleModeToggle}>
              {isSignIn ? "Sign Up" : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
