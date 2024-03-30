import { useState, useMemo } from "react";
import { process } from "../Data";
import { WatchType } from "../api";

type UseProcessFile = {
    handleProcess: (id: string, watchType: WatchType) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useProcessFile = (): UseProcessFile => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleProcess = async (id: string, watchType: WatchType): Promise<void> => {
        setIsLoading(true);
        try {
            await process(id, watchType);
            setErrorState(null);
        } catch (error) {
            setErrorState(`Processing ${watchType} file ${id} error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleProcess,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useProcessFile;
