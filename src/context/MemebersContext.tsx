import React, { createContext, useContext, useState } from 'react';
import { GroupMember } from '../models/GroupMember.model';

const MembersContext = createContext<{
    members: GroupMember[] | undefined;
    setMembers: React.Dispatch<React.SetStateAction<GroupMember[] | undefined>>;
}>({
    members: undefined,
    setMembers: () => {},
});

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [members, setMembers] = useState<GroupMember[]>();

    return (
        <MembersContext.Provider value={{ members, setMembers }}>
            {children}
        </MembersContext.Provider>
    );
};

// Custom hook to use the MembersContext
export const useMembers = () => useContext(MembersContext);