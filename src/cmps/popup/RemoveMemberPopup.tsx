import { FormEvent, useState } from "react";
import CloseButton from "../global/CloseButton";
import { addMemberToGroup, removeMemberFromGroup } from "../../services/group.service";
import { useMembers } from "../../context/MemebersContext";


interface RemoveMemberPopupProps {
    groupId: string;
    userId: string;
    onClose: () => void;
  }

  export default function RemoveMemberPopup({ groupId, userId, onClose } : RemoveMemberPopupProps) {
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const {members, setMembers, isChanged, setIsChanged} = useMembers();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try{
            if(selectedMemberId !== ""){
               const removedMember = await removeMemberFromGroup(groupId, selectedMemberId);
               setMembers(members?.filter((member => member.userId !== removedMember.userId)));
               setIsChanged(!isChanged);
               onClose();
            } else{
                setErrorMessage("You must select a group member!")
            }
            
        } catch (err) {
            const error = err as Error;
            setErrorMessage(error.message);
        }
    }

    const handleMemberSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMemberId(event.target.value);
      };

      
    return (
        <div className="remove-member-popup-overlay" onClick={onClose}>
            <div className="remove-member-popup-container" onClick={(e) => e.stopPropagation()}>
                <CloseButton size="14px" onClose={onClose} />
                <form onSubmit={handleSubmit} className="remove-member-popup-form">
                    <h2>Remove Member</h2>
                    <div className="remove-member-popup-text-fields">
                        <select className="remove-member-popup-select" value={selectedMemberId} onChange={handleMemberSelectChange}>
                            <option value="" disabled>Select a member</option>
                            {members?.filter((member => member.userId !== userId)).map((member) => (
                                <option key={member.userId} value={member.userId}>
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