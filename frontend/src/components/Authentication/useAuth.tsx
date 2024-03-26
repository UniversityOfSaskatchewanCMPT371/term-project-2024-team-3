import React, { createContext, useContext, ReactNode, useMemo } from "react";
import useIsUserLoggedIn from "shared/hooks/useIsUserLoggedIn";

type AuthContextValue = {
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue>({ isAuthenticated: false });

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
    const isAuthenticated = useIsUserLoggedIn();

    const value = useMemo(() => ({ isAuthenticated }), [isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
