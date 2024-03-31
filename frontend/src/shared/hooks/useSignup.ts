import { useState, useMemo } from "react";
import { signUp } from "../api";

type UseSignup = {
    handleSignup: (
        username: string,
        password: string,
        firstname: string,
        lastname: string,
    ) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useSignup = (): UseSignup => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleSignup = async (
        username: string,
        password: string,
        firstname: string,
        lastname: string,
    ): Promise<void> => {
        setIsLoading(true);
        try {
            await signUp(username, password, firstname, lastname);
            setErrorState(null);
        } catch (error) {
            setErrorState(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleSignup,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useSignup;
