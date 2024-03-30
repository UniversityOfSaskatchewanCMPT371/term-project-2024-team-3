import { useState, useMemo, useEffect } from "react";
import { getProcessedDataList } from "../Data";
import { ProcessedFileData, WatchType } from "../api";

type UseGetProcessedDataList = {
    uploadedFiles: Array<ProcessedFileData>;
    isLoading: boolean;
    error: string | null;
};

const useGetProcessedDataList = (watchType: WatchType): UseGetProcessedDataList => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Array<ProcessedFileData>>([]);

    useEffect(() => {
        getProcessedDataList(watchType)
            .then((data: any) => {
                setUploadedFiles(data.list);
            })
            .catch((error: Error) => {
                setErrorState(`An error occured while getting processed files: ${error.message}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return useMemo(
        () => ({
            uploadedFiles,
            isLoading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useGetProcessedDataList;
