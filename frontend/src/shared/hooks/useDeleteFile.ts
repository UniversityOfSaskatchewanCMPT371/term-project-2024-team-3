import { useState, useMemo } from "react";
import { useRollbar } from "@rollbar/react";
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
    const rollbar = useRollbar();

    const handleDelete = async (id: string, watchType: WatchType): Promise<void> => {
        setIsLoading(true);
        const deleteInfoMsg = `Delete request for file with id ${id} of watch type ${watchType}`;
        try {
            rollbar.info(`${deleteInfoMsg} sent.`);
            await deleteFile(id, watchType);
            rollbar.info(`${deleteInfoMsg}  completed with no errors.`);
            setErrorState(null);
        } catch (error) {
            rollbar.error(`${deleteInfoMsg}  failed.`);
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
