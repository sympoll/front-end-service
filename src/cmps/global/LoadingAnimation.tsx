import React from "react";

export default function LoadingAnimation() {
  return (
    <div className="feed-content-loading-container">
      <div className="feed-content-loading-message">
        Feed is loading
        <span className="dots">
          <span className="dot1">.</span>
          <span className="dot2">.</span>
          <span className="dot3">.</span>
        </span>
      </div>
      <div className="feed-content-loading-icon">
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
