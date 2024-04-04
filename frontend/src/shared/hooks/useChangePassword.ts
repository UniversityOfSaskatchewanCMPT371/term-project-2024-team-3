import { useState, useMemo } from "react";
import { changePassword } from "../api";

type UseChangePassword = {
    handleChangePassword: (password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useChangePassword = (): UseChangePassword => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleChangePassword = async (password: string): Promise<void> => {
        setIsLoading(true);
        try {
            await changePassword(password);
            setErrorState(null);
        } catch (error) {
            setErrorState(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleChangePassword,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useChangePassword;
