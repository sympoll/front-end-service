import React from "react";

interface BtnProps {
  children: string;
  name?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  theme?: "dark" | "light" | "warning";
  width?: string;
  height?: string;
  bgColor?: string;
  fontSize?: string;
}

export default function btn({
  children,
  onClick,
  type,
  name,
  disabled = false,
  theme = "light",
  width,
  height,
  bgColor,
  fontSize
}: BtnProps) {
  return (
    <button
      className={`custom-button custom-button__${theme}`}
      onClick={onClick}
      type={type}
      id={name}
      disabled={disabled}
      style={{
        width: width,
        height: height ?? "40px",
        backgroundColor: bgColor,
        fontSize: fontSize
      }}
    >
      {children}
    </button>
  );
}
