import { FormEvent, useState } from "react";
import CloseButton from "../global/CloseButton";
import { addMemberToGroup } from "../../services/group.service";
import { useMembers } from "../../context/MemebersContext";

interface AddMemberPopupProps {
  groupId: string;
  onClose: () => void;
}

export default function AddMemberPopup({ groupId, onClose }: AddMemberPopupProps) {
  const [memberUsername, setMemberUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { members, isChanged, setIsChanged } = useMembers();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      members?.push(await addMemberToGroup(groupId, memberUsername));
      setIsChanged(!isChanged);
      console.log("Member added to the group: ", memberUsername);
      onClose();
    } catch (err) {
      const error = err as Error;
      setErrorMessage(parseErrorMessage(error.message));
    }
  };

  const parseErrorMessage = (message: string): string => {
    // Check if the error message matches the pattern for a username not existing
    const match = message.match(/The username ([^"]+) does not exist/);
    if (match) {
      return `${match[1]} does not exist`;
    }

    return message;
  };

  return (
    <div className="add-member-popup-overlay" onClick={onClose}>
      <div className="add-member-popup-container" onClick={(e) => e.stopPropagation()}>
        <CloseButton size="14px" onClose={onClose} />
        <form onSubmit={handleSubmit} className="add-member-popup-form">
          <h2>Add New Member</h2>
          <div className="add-member-popup-text-fields">
            <input
              type="text"
              value={memberUsername}
              onChange={(e) => setMemberUsername(e.target.value)}
              placeholder="Enter here the member username"
              required
            />
          </div>
          <button type="submit" className="add-member-popup-form-button">
            Add Member
          </button>
          <label className="add-member-popup-error-label">{errorMessage}</label>
        </form>
      </div>
    </div>
  );
}
