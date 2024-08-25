import React from "react";

interface CloseButtonPops {
  size: string;
  onClose: () => void;
}

export default function CloseButton({ size, onClose }: CloseButtonPops) {
  return (
    <button
      className="global-close-button"
      style={{ "--btn-size": size } as React.CSSProperties}
      onClick={onClose}
    >
      ×
    </button>
  );
}
