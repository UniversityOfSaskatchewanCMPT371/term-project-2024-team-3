import { useState, useMemo, useEffect } from "react";
import { getUploadedFiles } from "../Data/index";
import { RawFileData, WatchType } from "../api";

type UseListUploadedFiles = {
  uploadedFiles: Array<RawFileData>;
  isLoading: boolean;
  error: string | null;
};

const useListUploadedFiles = (watchType: WatchType): UseListUploadedFiles => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<RawFileData>>([]);

  useEffect(() => {
    getUploadedFiles(watchType)
      .then((data) => {
        setUploadedFiles(data.list);
      })
      .catch((error: Error) => {
        setErrorState(
          `An error occured while getting uploaded files: ${error.toString}`,
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

export default useListUploadedFiles;
