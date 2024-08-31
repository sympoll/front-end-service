import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroupData } from '../../models/GroupData.model';
import { fetchUserGroups } from '../../services/group.service';

const GroupsContext = createContext<{
    groups: GroupData[] | undefined;
    setGroups: React.Dispatch<React.SetStateAction<GroupData[] | undefined>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    groups: undefined,
    setGroups: () => {},
    isLoading: true,
    setIsLoading: () => {}
});


export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<GroupData[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Temporary hardcoded user ID
    const userId = "b1f8e925-2129-473d-bc09-b3a2a331f839";

    useEffect(() => {
        fetchUserGroups(userId)
            .then((data) => {
                console.log("Fetching user groups data: ", data);
                setGroups(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user groups data.");
                setIsLoading(false);
            });
    }, []);

    return (
        <GroupsContext.Provider value={{ groups, setGroups, isLoading, setIsLoading }}>
            {children}
        </GroupsContext.Provider>
    );
};

// Custom hook to use the GroupsContext
export const useGroups = () => useContext(GroupsContext);