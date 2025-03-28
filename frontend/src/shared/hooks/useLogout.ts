import { useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const handleLogout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await logout();
            setErrorState(null);
        } catch (error) {
            setErrorState(error.message);
        } finally {
            setIsLoading(false);
            localStorage.removeItem("expires_at");
            localStorage.removeItem("user_id");
            removeCookie("SESSION");
            window.location.reload();
            navigate("/");
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
