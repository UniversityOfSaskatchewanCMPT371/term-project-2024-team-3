import { useState, useMemo } from "react";
import { useRollbar } from "@rollbar/react";
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
    const rollbar = useRollbar();

    const handleSignup = async (
        username: string,
        password: string,
        firstname: string,
        lastname: string,
    ): Promise<void> => {
        setIsLoading(true);
        const infoMsg = `Request for signup of user ${username}`;
        try {
            rollbar.info(`${infoMsg} sent.`);
            await signUp(username, password, firstname, lastname);
            setErrorState(null);
            rollbar.info(`${infoMsg} completed without errors.`);
        } catch (error) {
            setErrorState("Signup failed. Please try again.");
            rollbar.error(`${infoMsg} failed.`);
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
