import { useState, useMemo, useEffect } from "react";
import { getPredictedDataList } from "../Data";
import { FileData, PredictedFilesData, WatchType } from "../api";

type UseGetPredictedDataList = {
    uploadedFiles: Array<FileData>;
    isLoading: boolean;
    error: string | null;
};

const useGetPredictedDataList = (watchType: WatchType): UseGetPredictedDataList => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Array<FileData>>([]);

    useEffect(() => {
        getPredictedDataList(watchType)
            .then((data: PredictedFilesData) => {
                setUploadedFiles(data.list);
            })
            .catch((error: Error) => {
                setErrorState(`An error occured while getting predicted files: ${error.message}`);
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

export default useGetPredictedDataList;
