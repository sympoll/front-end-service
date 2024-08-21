import React from "react"

interface BtnProps {
  children: string
  onClick?(): void
  type?: "button" | "submit" | "reset"
}

export default function btn({ children, onClick, type }: BtnProps) {
  return (
    <button className="custom-button" onClick={onClick} type={type}>
      {children}
    </button>
  )
}
