import React, { useState, FormEvent, useEffect } from "react";
import { createNewGroup } from "../../services/group.service";
import { GroupData } from "../../models/GroupData.model";

interface CreateGroupPopupProps {
  userId: string;
  onClose: () => void;
  groups: GroupData[] | undefined;
}

export default function CreateGroupPopup({ userId, onClose, groups }: CreateGroupPopupProps) {
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitButtonText, setSubmitButtonText] = useState<string>("Create Group");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!groups) {
        return;
      }

      groups.push(
        await createNewGroup(
          groupName,
          groupDescription,
          userId,
          setIsCreating,
          setSubmitButtonText
        )
      );
      console.log("New Group Created:", groupName);
      onClose(); // Close the popup after submission
    } catch (err) {
      setErrorMessage(String(err));
    }
  };

  useEffect(() => {
    if (isCreating) {
      const texts = ["Creating...", "Creating..", "Creating.", "Creating"];
      let index = 0;
      const interval = setInterval(() => {
        setSubmitButtonText(texts[index]);
        index = (index + 1) % texts.length;
      }, 500); // Change text every 500ms

      return () => clearInterval(interval); // Clear interval when component unmounts or isCreating changes
    }
  }, [isCreating]);

  return (
    <div className="create-group-popup-overlay" onClick={onClose}>
      <div className="create-group-popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="create-group-popup-close-button" onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit} className="create-group-popup-form">
          <h2>Create New Group</h2>
          <div className="create-group-popup-text-fields">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              required
            />
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <button type="submit" className="create-group-popup-form-button">
            {submitButtonText}
          </button>
          <label>{errorMessage}</label>
        </form>
      </div>
    </div>
  );
}
