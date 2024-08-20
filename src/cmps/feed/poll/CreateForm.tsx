import React, { useState } from "react";

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleForm() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={`form-container ${isOpen ? "open" : "closed"}`}>
      <div className="toggle-button" onClick={toggleForm}>
        <span>+</span>
      </div>
    </div>
  );
}
