import React, { createContext, useContext, useState } from 'react';
import { GroupMember } from '../models/GroupMember.model';

const MembersContext = createContext<{
    members: GroupMember[] | undefined;
    setMembers: React.Dispatch<React.SetStateAction<GroupMember[] | undefined>>;
    isChanged: boolean;
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
    setNewRoleToUser: (userId: string, roleName: string) => void;
}>({
    members: undefined,
    setMembers: () => {},
    isChanged: false,
    setIsChanged: () => {},
    setNewRoleToUser: () => {} 
});

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [members, setMembers] = useState<GroupMember[]>();
    const [isChanged, setIsChanged] = useState(false);

    const setNewRoleToUser = (userId: string, roleName: string) => {
        setMembers(prevMembers => {
            if (!prevMembers) return prevMembers;

            const updatedMembers = prevMembers.map(member => 
                member.userId === userId 
                    ? { ...member, role: roleName } 
                    : member
            );

            setIsChanged(!isChanged);
            return updatedMembers;
        });
    };

    return (
        <MembersContext.Provider value={{ members, setMembers, isChanged, setIsChanged, setNewRoleToUser }}>
            {children}
        </MembersContext.Provider>
    );
};

// Custom hook to use the MembersContext
export const useMembers = () => useContext(MembersContext);