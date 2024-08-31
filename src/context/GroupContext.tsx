import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroupData } from '../models/GroupData.model';

const GroupsContext = createContext<{
    groups: GroupData[] | undefined;
    setGroups: React.Dispatch<React.SetStateAction<GroupData[] | undefined>>;
}>({
    groups: undefined,
    setGroups: () => {},
});


export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<GroupData[]>();

    return (
        <GroupsContext.Provider value={{ groups, setGroups }}>
            {children}
        </GroupsContext.Provider>
    );
};

// Custom hook to use the GroupsContext
export const useGroups = () => useContext(GroupsContext);