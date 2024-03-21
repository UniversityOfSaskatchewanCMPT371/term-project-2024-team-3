import { useState, useMemo, useEffect } from "react";
import { useRollbar } from "@rollbar/react";
import { getPredictedDataList } from "../Data/index";
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
    const rollbar = useRollbar();

    useEffect(() => {
        const infoMsg = `Request for list of predicted ${watchType} data`;
        rollbar.info(`${infoMsg} is being sent.`);
        getPredictedDataList(watchType)
            .then((data: PredictedFilesData) => {
                setUploadedFiles(data.list);
                rollbar.info(`${infoMsg} completed without errors.`);
            })
            .catch((error: Error) => {
                setErrorState(`An error occured while getting predicted files: ${error.toString}`);
                rollbar.error(`${infoMsg} failed.`);
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
