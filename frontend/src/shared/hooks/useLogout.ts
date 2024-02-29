import { useState, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useCookies } from "react-cookie";
import { logout } from "../api";

type UseLogout = {
    handleLogout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useLogout = (): UseLogout => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [, setExpiresAt] = useLocalStorage("expires_at", "");
    const [, setUserId] = useLocalStorage("user_id", -1);
    const [, , removeCookie] = useCookies(["SESSION"]);

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await logout();
            setExpiresAt("");
            setUserId(-1);
            removeCookie("SESSION");
        } catch (error) {
            setErrorState("Logout failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleLogout,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useLogout;
