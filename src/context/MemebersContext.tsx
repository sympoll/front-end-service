import React, { createContext, useContext, useState } from "react";
import { GroupMember } from "../models/GroupMember.model";

const MembersContext = createContext<{
  members: GroupMember[] | undefined;
  setMembers: React.Dispatch<React.SetStateAction<GroupMember[] | undefined>>;
  setNewRoleToUser: (userId: string, roleName: string) => void;
  getMemberRole: (userId: string) => string;
  sortMembers: (members: GroupMember[]) => GroupMember[];
}>({
  members: undefined,
  setMembers: () => {},
  setNewRoleToUser: () => {},
  getMemberRole: () => "",
  sortMembers: () => []
});

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<GroupMember[]>();

  const setNewRoleToUser = (userId: string, roleName: string) => {
    setMembers((prevMembers) => {
      if (!prevMembers) return prevMembers;

      const updatedMembers = prevMembers.map((member) => {
        if (member.userData.userId === userId) {
          console.log("Updating member:", member);
          return { ...member, roleName: roleName };
        }
        return member;
      });

      const sortedMembers = sortMembers(updatedMembers);
      return sortedMembers;
    });
  };

  const getMemberRole = (userId: string) => {
    return members?.find((member) => member.userData.userId === userId)?.roleName ?? "";
  };

  const sortMembers = (members: GroupMember[]) => {
    return members.sort((a, b) => {
      const roleOrder: { [key: string]: number } = {
        Admin: 1,
        Moderator: 2,
        Member: 4
      };
      // Give a higher order number to roles that are not 'Member'
      const aRoleOrder = roleOrder[a.roleName] || 3;
      const bRoleOrder = roleOrder[b.roleName] || 3;

      return aRoleOrder - bRoleOrder;
    });
  };

  return (
    <MembersContext.Provider
      value={{
        members,
        setMembers,
        setNewRoleToUser,
        getMemberRole,
        sortMembers
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

// Custom hook to use the MembersContext
export const useMembers = () => useContext(MembersContext);
