import { useState, useMemo, useEffect } from "react";
import { UserData, getUser } from "../api";

type UseGetUser = {
    user: UserData | null;
    isLoading: boolean;
    error: string | null;
};

const useGetUser = (): UseGetUser => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        getUser()
            .then((data) => {
                setUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userName: data.userName,
                });
                setErrorState(null);
            })
            .catch((error: Error) => {
                setErrorState(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return useMemo(
        () => ({
            user,
            isLoading,
            error: errorState,
        }),
        [user, isLoading, errorState],
    );
};

export default useGetUser;
