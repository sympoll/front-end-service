import React from "react";

interface BtnProps {
  children: string;
  name?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset";
}

export default function btn({ children, onClick, type, name }: BtnProps) {
  return (
    <button className="custom-button" onClick={onClick} type={type} name={name}>
      {children}
    </button>
  );
}
