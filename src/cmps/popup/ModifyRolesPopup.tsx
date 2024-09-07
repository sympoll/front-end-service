import { FormEvent, useState } from "react";
import { useMembers } from "../../context/MemebersContext";
import CloseButton from "../global/CloseButton";
import { createUserRole, deleteUserRole, updateUserRole } from "../../services/group.service";
import { UserRoleName } from "../../models/enum/UserRoleName.enum";

interface ModifyRolesPopupProps {
  groupId: string;
  userId: string | undefined;
  onClose: () => void;
}

export default function ModifyRolesPopup({ groupId, userId, onClose }: ModifyRolesPopupProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMemberRole, setSelectedMemberRole] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isMemberSelected, setIsMemberSelected] = useState<boolean>(false);
  const { members, setNewRoleToUser } = useMembers();

  const [roles, setRoles] = useState<UserRoleName[]>([
    UserRoleName.ADMIN,
    UserRoleName.MODERATOR,
    UserRoleName.MEMBER
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // User set to be a simple member
    if (selectedRole === UserRoleName.MEMBER) {
      deleteUserRole(selectedMemberId, groupId, selectedMemberRole)
        .then(() => {
          setNewRoleToUser(selectedMemberId, UserRoleName.MEMBER);
          onClose();
        })
        .catch((error) => {
          console.log("Unable to set role to " + userId);
          setErrorMessage(String(error));
        });

      // User set to have a role in the group
    } else {
      // User is currently a simple member
      if (selectedMemberRole === UserRoleName.MEMBER) {
        createUserRole(selectedMemberId, groupId, selectedRole)
          .then(() => {
            setNewRoleToUser(selectedMemberId, selectedRole);
            console.log("Current members: ", members);
            onClose();
          })
          .catch((error) => {
            console.log("Unable to set role to " + userId);
            setErrorMessage(String(error));
          });
      } else {
        // User is currently not a simple member
        updateUserRole(selectedMemberId, groupId, selectedRole)
          .then(() => {
            setNewRoleToUser(selectedMemberId, selectedRole);
            onClose();
          })
          .catch((error) => {
            console.log("Unable to set role to " + userId);
            setErrorMessage(String(error));
          });
      }
    }
  };

  const handleMemberSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMemberId(event.target.value);
    setSelectedMemberRole(
      members?.find((member) => member.userData.userId === event.target.value)?.roleName ?? ""
    );
    setIsMemberSelected(true);
  };

  const handlerRoleelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="modify-roles-popup-overlay" onClick={onClose}>
      <div className="modify-roles-popup-container" onClick={(e) => e.stopPropagation()}>
        <CloseButton size="14px" onClose={onClose} />
        <form onSubmit={handleSubmit} className="modify-roles-popup-form">
          <h2>Modify Members Roles</h2>
          <div className="modify-roles-popup-text-fields">
            <select
              className="modify-roles-popup-select"
              value={selectedMemberId}
              onChange={handleMemberSelectChange}
            >
              <option value="" disabled>
                Select a member
              </option>
              {members
                ?.filter((member) => member.userData.userId !== userId)
                .map((member) => (
                  <option key={member.userData.userId} value={member.userData.userId}>
                    {member.userData.username}
                  </option>
                ))}
            </select>
          </div>
          {isMemberSelected && (
            <div className="modify-roles-popup-selected-member">
              <div className="modify-roles-popup-selected-member-info">
                <h3>Current role:</h3>
                <label className="modify-roles-popup-selected-member-label">
                  {selectedMemberRole}
                </label>
              </div>
              <div className="modify-roles-popup-selected-member-actions">
                <select
                  className="modify-roles-popup-select"
                  value={selectedRole}
                  onChange={handlerRoleelectChange}
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles
                    ?.filter((role) => role !== selectedMemberRole)
                    .map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}
          {isMemberSelected && (
            <button type="submit" className="modify-roles-popup-form-button">
              Set Role
            </button>
          )}
          <label className="modify-roles-popup-error-label">{errorMessage}</label>
        </form>
      </div>
    </div>
  );
}
