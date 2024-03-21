import { useState, useMemo, useEffect } from "react";
import { useRollbar } from "@rollbar/react";
import { getUploadedFiles } from "../Data/index";
import { RawFileData, WatchType } from "../api";

type UseGetUploadedFiles = {
    uploadedFiles: Array<RawFileData>;
    isLoading: boolean;
    error: string | null;
};

const useGetUploadedFiles = (watchType: WatchType): UseGetUploadedFiles => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Array<RawFileData>>([]);
    const rollbar = useRollbar();

    useEffect(() => {
        const infoMsg = `Request for uploaded files of type ${watchType}`;
        rollbar.info(`${infoMsg} is being sent.`);
        getUploadedFiles(watchType)
            .then((data) => {
                setUploadedFiles(data.list);
                rollbar.info(`${infoMsg} completed without errors.`);
            })
            .catch((error: Error) => {
                setErrorState(`An error occured while getting uploaded files: ${error.toString}`);
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

export default useGetUploadedFiles;
