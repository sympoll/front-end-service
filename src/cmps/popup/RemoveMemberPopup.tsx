import { FormEvent, useState } from "react";
import CloseButton from "../global/CloseButton";
import { addMemberToGroup } from "../../services/group.service";
import { useMembers } from "../../context/MemebersContext";


interface RemoveMemberPopupProps {
    groupId: string;
    onClose: () => void;
  }

  export default function RemoveMemberPopup({ groupId, onClose } : RemoveMemberPopupProps) {
    const [memberUsername, setMemberUsername] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const {members, isChanged, setIsChanged} = useMembers();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try{
            onClose();
        } catch (err) {
            const error = err as Error;
            setErrorMessage(parseErrorMessage(error.message));
        }
    }

    const parseErrorMessage = (message: string): string => {
        // Check if the error message matches the pattern for a username not existing
        const match = message.match(/The username ([^"]+) does not exist/);
        if (match) {
            return `${match[1]} does not exist`;
        }
        
        return message;
    };

    const handleMemberSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMemberUsername(event.target.value);
      };

      
    return (
        <div className="remove-member-popup-overlay" onClick={onClose}>
            <div className="remove-member-popup-container" onClick={(e) => e.stopPropagation()}>
                <CloseButton size="14px" onClose={onClose} />
                <form onSubmit={handleSubmit} className="remove-member-popup-form">
                    <h2>Remove Member</h2>
                    <div className="remove-member-popup-text-fields">
                        <select className="remove-member-popup-select" value={memberUsername} onChange={handleMemberSelectChange}>
                            <option value="" disabled>Select a member</option>
                            {members?.map((member) => (
                                <option key={member.userId} value={member.username}>
                                    {member.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="remove-member-popup-form-button">
                        Remove Member
                    </button>
                    <label className="remove-member-popup-error-label">{errorMessage}</label>
                </form>
            </div>
        </div>
    )
  }