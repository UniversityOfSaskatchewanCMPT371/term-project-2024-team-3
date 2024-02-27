import { useState, useMemo } from "react";
import { download } from "../Data/index";
import { saveAs } from "file-saver";
import { PredictionType, WatchType } from "../api";

type UseDownload = {
  handleDownload: (
    id: string,
    type: string,
    watchType: WatchType,
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const useDownload = (): UseDownload => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  /**
   * creates a blob for a file for download
   * @param b64Data the data to be downloaded
   * @param contentType a string representing the type
   * @param sliceSize the size of the slice for the blob
   * @returns a blob for downloading
   */
  const b64toBlob = function (
    b64Data: string,
    contentType: string,
    sliceSize: number,
  ) {
    // contentType = contentType || "";
    // sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const handleDownload = async (
    id: string,
    type: string,
    watchType: WatchType,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await download(id, type, watchType).then((response: any) => {
        const blob = b64toBlob(
          response.data.file,
          "application/octet-stream",
          512,
        );
        saveAs(blob, `${watchType} ${id}.zip`);
      });
      setErrorState(null);
    } catch (error) {
      setErrorState("Delete File failed");
    } finally {
      setIsLoading(false);
    }
  };

  return useMemo(
    () => ({
      handleDownload,
      isLoading,
      error: errorState,
    }),
    [isLoading, errorState],
  );
};

export default useDownload;
