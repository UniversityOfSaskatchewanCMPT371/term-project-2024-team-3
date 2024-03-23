import { useState, useMemo, useEffect } from "react";
import { getUploadedFiles } from "../Data/index";
import { RawFileData, WatchType } from "../api";

type UseGetUploadedFiles = {
    uploadedFiles: Array<RawFileData>;
    isLoading: boolean;
    error: string | null;
};

const useGetUploadedFiles = (watchType: WatchType, refetch = false): UseGetUploadedFiles => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Array<RawFileData>>([]);

    useEffect(() => {
        getUploadedFiles(watchType)
            .then((data) => {
                setUploadedFiles(data.list);
            })
            .catch((error: Error) => {
                setErrorState(`An error occured while getting uploaded files: ${error.message}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refetch]);

    return useMemo(
        () => ({
            uploadedFiles,
            isLoading,
            error: errorState,
        }),
        [uploadedFiles, isLoading, errorState],
    );
};

export default useGetUploadedFiles;
