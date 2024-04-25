import React from "react";

interface BtnProps {
  children: string;
  onClick(): void;
}

export default function btn({ children, onClick }: BtnProps) {
  return <button onClick={onClick}>{children}</button>;
}
