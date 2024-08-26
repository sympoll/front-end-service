import React from "react";

interface LoadingAnimationProps {
  message: string;
  messageFontSize?: string;
  ripple?: "on" | "off";
  dots?: "on" | "off";
}

export default function LoadingAnimation({
  message,
  messageFontSize = "20px",
  ripple = "on",
  dots = "on"
}: LoadingAnimationProps) {
  return (
    <div className="content-loading-container">
      <div className="content-loading-message" style={{ fontSize: messageFontSize }}>
        {message}
        {dots === "on" && (
          <span className="dots">
            <span className="dot1">.</span>
            <span className="dot2">.</span>
            <span className="dot3">.</span>
          </span>
        )}
      </div>
      {ripple === "on" && (
        <div className="content-loading-icon">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}
