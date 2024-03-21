import { useState, useMemo, useEffect } from "react";
import { useRollbar } from "@rollbar/react";
import { getProcessedDataList } from "../Data/index";
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
    const rollbar = useRollbar();

    useEffect(() => {
        const infoMsg = `Request for list of processed ${watchType} data`;
        rollbar.info(`${infoMsg} is being sent.`);
        getProcessedDataList(watchType)
            .then((data: any) => {
                setUploadedFiles(data.list);
                rollbar.info(`${infoMsg} completed without errors.`);
            })
            .catch((error: Error) => {
                setErrorState(`An error occured while getting processed files: ${error.toString}`);
                rollbar.info(`${infoMsg} failed`);
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
