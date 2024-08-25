import React from "react";

interface BtnProps {
  children: string;
  name?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  theme?: "dark" | "light";
}

export default function btn({
  children,
  onClick,
  type,
  name,
  disabled = false,
  theme = "light"
}: BtnProps) {
  return (
    <button
      className={`custom-button custom-button__${theme}`}
      onClick={onClick}
      type={type}
      name={name}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
