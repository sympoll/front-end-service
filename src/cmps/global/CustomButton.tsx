import React from "react";

interface BtnProps {
  children: string;
  name?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  theme?: "dark" | "light" | "warning";
  width?: string;
  bgColor?: string;
}

export default function btn({
  children,
  onClick,
  type,
  name,
  disabled = false,
  theme = "light",
  width,
  bgColor
}: BtnProps) {
  return (
    <button
      className={`custom-button custom-button__${theme}`}
      onClick={onClick}
      type={type}
      id={name}
      disabled={disabled}
      style={{ width: width, backgroundColor: bgColor }}
    >
      {children}
    </button>
  );
}
