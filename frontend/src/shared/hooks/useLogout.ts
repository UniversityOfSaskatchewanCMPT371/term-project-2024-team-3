import { useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useRollbar } from "@rollbar/react";
import { logout } from "../api";

type UseLogout = {
    handleLogout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useLogout = (): UseLogout => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [, , removeCookie] = useCookies(["SESSION"]);
    const rollbar = useRollbar();

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            rollbar.info("attempting logout");
            await logout();
            rollbar.info("successful logout");
        } catch (error) {
            setErrorState("Logout failed. Please try again.");
            rollbar.info("Logout failed");
        } finally {
            setIsLoading(false);
            localStorage.removeItem("expires_at");
            localStorage.removeItem("user_id");
            removeCookie("SESSION");
            window.location.reload();
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
