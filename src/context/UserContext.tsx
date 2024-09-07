import React, { createContext, useContext, useState, ReactNode } from "react";

// This file defines the UserProvider component and UserContext for managing user data within the React application.
// The UserProvider component maintains user state and provides it along with a setUser function via the UserContext to its child components.
// The useUser hook offers a convenient way to access and update user data in components that consume the UserContext.

// Define the type for user data
interface UserData {
  userId: string;
  username: string;
  email: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component to provide user state to the app
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
