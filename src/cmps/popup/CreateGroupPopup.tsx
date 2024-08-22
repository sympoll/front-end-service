import React, { useState, FormEvent } from 'react';
import { createNewGroup } from '../../services/group.service';

interface CreateGroupPopupProps {
  userId: string;
  onClose: () => void;
}

export default function CreateGroupPopup({ userId, onClose }: CreateGroupPopupProps) {
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      createNewGroup(groupName, groupDescription, userId);
      await console.log('New Group Created:', groupName);
      onClose(); // Close the popup after submission
    } catch(err) {
      setErrorMessage(String(err));
    }
  };

  return (
    <div className="create-group-popup-overlay" onClick={onClose}>
      <div className="create-group-popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="create-group-popup-close-button" onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <h2>Create New Group</h2>
            <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                required
            />
            Description:
            <input
                type="text"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Description"
                required
            />
          <button type="submit" className='create-group-popup-form-button'>Create Group</button>
          <label>{errorMessage}</label>
        </form>
      </div>
    </div>
  );
};