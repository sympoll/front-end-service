import React, { createContext, useContext, useState } from 'react';
import { GroupMember } from '../models/GroupMember.model';

const MembersContext = createContext<{
    members: GroupMember[] | undefined;
    setMembers: React.Dispatch<React.SetStateAction<GroupMember[] | undefined>>;
    isChanged: boolean;
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    members: undefined,
    setMembers: () => {},
    isChanged: false,
    setIsChanged: () => {} 
});

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [members, setMembers] = useState<GroupMember[]>();
    const [isChanged, setIsChanged] = useState(false);

    return (
        <MembersContext.Provider value={{ members, setMembers, isChanged, setIsChanged }}>
            {children}
        </MembersContext.Provider>
    );
};

// Custom hook to use the MembersContext
export const useMembers = () => useContext(MembersContext);