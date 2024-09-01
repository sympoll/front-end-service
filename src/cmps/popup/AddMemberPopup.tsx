import { FormEvent, useState } from "react";
import CloseButton from "../global/CloseButton";


interface AddMemberPopupProps {
    groupId: string;
    onClose: () => void;
  }

  export default function AddMemberPopup({ groupId, onClose } : AddMemberPopupProps) {
    const [memberUsername, setMemberUsername] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
    }


    return (
        <div className="add-member-popup-ovelay">
            <div className="add-member-popup-container">
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
                        Add Member!
                    </button>
                    <label className="add-member-popup-error-label">{errorMessage}</label>
                </form>
            </div>
        </div>
    )
  }