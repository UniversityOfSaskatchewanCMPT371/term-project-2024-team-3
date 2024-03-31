import { useState, useMemo } from "react";
import { deleteAccount } from "../api";
import useLogout from "./useLogout";

type UseDeleteAccount = {
    handleAccountDelete: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useDeleteAccount = (): UseDeleteAccount => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);
    const { handleLogout } = useLogout();

    const handleAccountDelete = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await deleteAccount();
            await handleLogout();
            setErrorState(null);
        } catch (error) {
            setErrorState(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleAccountDelete,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useDeleteAccount;
