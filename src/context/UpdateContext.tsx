// UpdateContext.tsx
import React, { createContext, useState, useCallback, useContext } from "react";

/* This is the update context responsible for adding components to the update button.
In order to add the functionality of self updating to a component, follow the following steps:

1) Add the following Hook:

  const { registerForUpdate } = useUpdateContext(); // Access context

2) Implement an update component function. For example, this is the update function in the group sidebar:

    const updateGroups = useCallback(async () => {
    try {
      const fetchedGroups = await fetchUserGroups(userId);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error(cmpName + error);
      setIsLoading(false);
    }
  }, [userId]);

3) Add useEffect in the component responsible for registration of the update function with the update context.
For example, this is the useEffect in the group sidebar:

useEffect(() => {
    // Register the updateGroups function and handle unregistration
    const unregister = registerForUpdate(updateGroups);
    return () => {
      unregister();
    };
  }, [registerForUpdate, updateGroups]);
*/

interface UpdateContextType {
  registerForUpdate: (callback: () => void) => () => void; // Updated to return a function
  triggerUpdate: () => void;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updateCallbacks, setUpdateCallbacks] = useState<(() => void)[]>([]);

  const registerForUpdate = useCallback((callback: () => void) => {
    setUpdateCallbacks((prevCallbacks) => [...prevCallbacks, callback]);

    // Return an unregister function
    return () => {
      setUpdateCallbacks((prevCallbacks) => prevCallbacks.filter((cb) => cb !== callback));
    };
  }, []);

  const triggerUpdate = useCallback(() => {
    updateCallbacks.forEach((callback) => callback());
  }, [updateCallbacks]);

  return (
    <UpdateContext.Provider value={{ registerForUpdate, triggerUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdateContext = () => {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error("useUpdateContext must be used within an UpdateProvider");
  }
  return context;
};
