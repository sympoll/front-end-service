import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invokeSignUp, validateUserData } from "../services/signup.service";
import { UserData } from "../models/UserData.model";
import ErrorPopup from "../cmps/popup/ErrorPopup";

const SPACE = " ";
const EMPTY_STR = "";
const MAX_PASS_LEN = 20;
const MAX_USERNAME_LEN = 20;
const MAX_EMAIL_LEN = 20;

export default function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(true); // true = log in mode, false = sign up mode
  const [username, setUsername] = useState(EMPTY_STR);
  const [email, setEmail] = useState(EMPTY_STR);
  const [password, setPassword] = useState(EMPTY_STR);
  const [passwordConfirm, setPasswordConfirm] = useState(EMPTY_STR);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);

  const navigate = useNavigate();

  const closeErrorPopup = () => {
    setIsErrorPopupVisible(false);
  };
  const showErrorPopup = () => {
    setIsErrorPopupVisible(true);
  };

  const clearInputs = () => {
    setUsername(EMPTY_STR);
    setEmail(EMPTY_STR);
    setPassword(EMPTY_STR);
    setPasswordConfirm(EMPTY_STR);
    setShowPassword(false);
    closeErrorPopup();
  };

  useEffect(() => {
    clearInputs();
  }, [isSignIn]);

  const handleModeToggle = () => {
    setIsSignIn(!isSignIn);
  };

  const handleShowPasswordCheck = () => {
    setShowPassword(!showPassword);
  };

  const handleLogIn = (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Add login logic

    // TODO: appy user as signed in

    // navigate("/feed");
  };

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault();

    const userData: UserData = { username: username, email: email, password: password };
    const isValidData = validateUserData(userData, passwordConfirm, setErrorMessage);
    if (!isValidData) {
      showErrorPopup();
      console.log("Invalid user data entered: " + errorMessage);
      return;
    }

    invokeSignUp(userData)
      .then((data) => {
        console.log("Successfully Signed up user: " + data);

        // TODO: appy user as signed in

        navigate("/feed");
      })
      .catch((err) => {
        console.error("Could not sign up user. " + err);
        setErrorMessage(err.message);
        showErrorPopup();
      });
  };

  const preventSpaceKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === SPACE) event.preventDefault();
  };

  return (
    <section className="login-page-container">
      <div className="login-form-container">
        <p className="login-form-title">{isSignIn ? "Log In" : "Sign Up"} to Sympoll™</p>
        <form className="login-form" onSubmit={isSignIn ? handleLogIn : handleSignUp}>
          <div className="login-form-swap-mode">
            <p>
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <Link to="" onClick={handleModeToggle}>
                {isSignIn ? "Sign Up" : "Log In"}
              </Link>
            </p>
          </div>
          <div className="login-form-error-message">
            {isErrorPopupVisible && (
              <ErrorPopup message={errorMessage} closeErrorPopup={closeErrorPopup} />
            )}
          </div>
          <div className="login-form-input-fields">
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
              type={showPassword ? "text" : "password"}
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
                type={showPassword ? "text" : "password"}
                onKeyDown={preventSpaceKeyPress}
                maxLength={MAX_PASS_LEN}
                placeholder="Confirm Password..."
                value={passwordConfirm}
                onChange={(event) => {
                  setPasswordConfirm(event.target.value);
                }}
              />
            )}
          </div>
          {isSignIn ? (
            <p>
              <Link to="/reset-account">Forgot Username / Password?</Link>
            </p>
          ) : (
            <></>
          )}
          <div className="show-password-container">
            <input
              id="show-password-checkbox"
              type="checkbox"
              checked={showPassword}
              onChange={handleShowPasswordCheck}
            />
            <label htmlFor="show-password-checkbox" className="toggle">
              <span>
                <svg width="10px" height="10px" viewBox="0 0 10 10">
                  <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
                </svg>
              </span>
              <div id="show-password-label">Show Password</div>
            </label>
          </div>
          <button type="submit">{isSignIn ? "Log In" : "Sign Up"}</button>
        </form>
      </div>
    </section>
  );
}
