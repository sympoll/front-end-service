import React, { createContext, useContext, useState } from 'react';
import { GroupMember } from '../models/GroupMember.model';

const MembersContext = createContext<{
    members: GroupMember[] | undefined;
    setMembers: React.Dispatch<React.SetStateAction<GroupMember[] | undefined>>;
    isChanged: boolean;
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
    setNewRoleToUser: (userId: string, roleName: string) => void;
    getMemberRole: (userId: string) => string;
}>({
    members: undefined,
    setMembers: () => {},
    isChanged: false,
    setIsChanged: () => {},
    setNewRoleToUser: () => {},
    getMemberRole: () => ""
});

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [members, setMembers] = useState<GroupMember[]>();
    const [isChanged, setIsChanged] = useState(false);

    const setNewRoleToUser = (userId: string, roleName: string) => {
        setMembers(prevMembers => {
            if (!prevMembers) return prevMembers;

            const updatedMembers = prevMembers.map(member => {
                if (member.userId === userId) {
                    console.log('Updating member:', member);
                    return { ...member, roleName: roleName };
                }
                return member;
            });

            setIsChanged(prev => !prev); 
            return updatedMembers;
        });
    };

    const getMemberRole = (userId: string) => {
        return members?.find((member) => member.userId === userId)?.roleName ?? "";
    }

    return (
        <MembersContext.Provider value={{ members, setMembers, isChanged, setIsChanged, setNewRoleToUser, getMemberRole }}>
            {children}
        </MembersContext.Provider>
    );
};

// Custom hook to use the MembersContext
export const useMembers = () => useContext(MembersContext);