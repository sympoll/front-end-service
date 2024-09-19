import React from "react";

interface ErrorPopupProps {
  message: string;
  closeErrorPopup: () => void;
}

export default function ErrorPopup({ message, closeErrorPopup }: ErrorPopupProps) {
  return (
    <div className="error-popup-container" onClick={(e) => e.stopPropagation()}>
      <button className="error-popup-close-button" onClick={closeErrorPopup}>
        ×
      </button>
      <p onClick={closeErrorPopup}>{message}</p>
    </div>
  );
}
