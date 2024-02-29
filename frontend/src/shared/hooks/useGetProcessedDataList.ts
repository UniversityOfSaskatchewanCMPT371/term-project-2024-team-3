import { useState, useMemo, useEffect } from "react";
import { getProcessedDataList } from "../Data/index";
import { ProcessedFileData, WatchType } from "../api";

type UseListProcessedFiles = {
  uploadedFiles: Array<ProcessedFileData>;
  isLoading: boolean;
  error: string | null;
};

const useListProcessedFiles = (watchType: WatchType): UseListProcessedFiles => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<ProcessedFileData>>(
    [],
  );

  useEffect(() => {
    getProcessedDataList(watchType)
      .then((data: any) => {
        setUploadedFiles(data.list);
      })
      .catch((error: Error) => {
        setErrorState(
          `An error occured while getting processed files: ${error.toString}`,
        );
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

export default useListProcessedFiles;
