import { useState, useMemo } from "react";
import { deleteData } from "../api";

type UseDeleteData = {
    handleDataDelete: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useDeleteData = (): UseDeleteData => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleDataDelete = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await deleteData();
            setErrorState(null);
        } catch (error) {
            setErrorState(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleDataDelete,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useDeleteData;
