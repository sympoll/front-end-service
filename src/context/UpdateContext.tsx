// UpdateContext.tsx
import React, { createContext, useState, useCallback, useContext } from "react";

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
