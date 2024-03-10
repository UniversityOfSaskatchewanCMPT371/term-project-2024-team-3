import { useState, useMemo } from "react";
import { deleteFile } from "../Data/index";
import { WatchType } from "../api";

type UseDeleteFile = {
    handleDelete: (id: string, watchType: WatchType) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useDeleteFile = (): UseDeleteFile => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleDelete = async (id: string, watchType: WatchType): Promise<void> => {
        setIsLoading(true);
        try {
            await deleteFile(id, watchType);
            setErrorState(null);
        } catch (error) {
            setErrorState("Delete File failed");
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleDelete,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useDeleteFile;
