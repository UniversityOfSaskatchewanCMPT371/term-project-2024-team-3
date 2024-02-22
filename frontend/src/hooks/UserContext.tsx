import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";

// Define a type for the user
// This will be the shape of our user object, defining what values it will hold.
type User = {
  id: string; // The unique identifier for the user
  name: string; // The name of the user
  password: string; // The password of the user
};

// Define a type for the context value
// This will be the shape of our context, defining what values it will hold.
type UserContextValue = {
  user: User | null; // The current logged in user, or null if no user is logged in
  login: (userData: User) => void; // A function to set the current user
  logout: () => void; // A function to clear the current user
};

// Define the context
// We're using React's createContext function to create a new context.
// We pass in undefined as the default value, which means consumers of this context must check if it's undefined before using it.
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Define the provider
// This is a React component that will provide the context value to any of its children.
function UserProvider({ children }: { children: ReactNode }) {
  // We're using React's useState hook to manage the user state.
  const [user, setUser] = useState<User | null>(null);

  // Define the login function, which sets the current user
  const login = (userData: User) => {
    setUser(userData);
  };

  // Define the logout function, which clears the current user
  const logout = () => {
    setUser(null);
  };

  // Use useMemo to avoid creating a new context value unless `user` changes
  const value = useMemo(() => ({ user, login, logout }), [user]);

  // Render the UserContext.Provider component, passing in the context value.
  // Any child components will have access to this value.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook that shorthands the context!
// This is a custom hook that provides a shorthand way to consume our UserContext.
// It throws an error if the context is undefined, which means this hook must be used inside a component that is a child of UserProvider.
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Export the UserProvider and UserContext so they can be used in other components.
export { UserProvider, UserContext };
