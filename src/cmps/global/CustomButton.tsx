import React from "react";

interface BtnProps {
  children: string;
  name?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function btn({ children, onClick, type, name, disabled = false }: BtnProps) {
  return (
    <button className="custom-button" onClick={onClick} type={type} name={name} disabled={disabled}>
      {children}
    </button>
  );
}
