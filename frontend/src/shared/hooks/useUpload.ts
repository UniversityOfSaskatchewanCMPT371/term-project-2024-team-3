import { useState, useMemo } from "react";
import { upload } from "shared/Data";
import { WatchType } from "../api";

type UseUpload = {
    handleUpload: (form: FormData, year: string, watchType: WatchType) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useUpload = (): UseUpload => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    const handleUpload = async (
        form: FormData,
        year: string,
        watchType: WatchType,
    ): Promise<void> => {
        setIsLoading(true);
        try {
            await upload(form, year, watchType);
        } catch (error) {
            setErrorState("Upload failed. Please Try Again.");
        } finally {
            setIsLoading(false);
        }
    };

    return useMemo(
        () => ({
            handleUpload,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useUpload;
