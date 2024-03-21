import { useState, useMemo } from "react";
import { upload } from "shared/Data";
import { useRollbar } from "@rollbar/react";
import { WatchType } from "../api";

type UseUpload = {
    handleUpload: (form: FormData, year: string, watchType: WatchType) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const useUpload = (): UseUpload => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);
    const rollbar = useRollbar();

    const handleUpload = async (
        form: FormData,
        year: string,
        watchType: WatchType,
    ): Promise<void> => {
        setIsLoading(true);
        try {
            rollbar.info(`Upload request sent with type ${watchType} and year ${year}`);
            await upload(form, year, watchType);
            rollbar.info("Upload complete with no errors.");
        } catch (error) {
            setErrorState("Upload failed. Please Try Again.");
            rollbar.error("Upload failed. Please Try Again.");
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
