import React from "react";


interface CreateGroupButtonProps {
  onClick: () => void;
}

export default function CreateGroupButton({onClick}: CreateGroupButtonProps) {
    return (
        <div className="create-group-button">
          <button
            className="create-group-btn"
            onClick={onClick}
          >New Group</button>
        </div>
      );
}
