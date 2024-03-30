import { useMemo, useState } from "react";
import { saveAs } from "file-saver";
import { download } from "../Data";
import { DownloadType, WatchType } from "../api";

type UseDownload = {
    handleDownload: (id: string, type: DownloadType, watchType: WatchType) => Promise<void>;
    isLoading: boolean;
    isDownloading: boolean;
    error: string | null;
};

const useDownload = (): UseDownload => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    /**
     * creates a blob for a file for download
     * @param b64Data the data to be downloaded
     * @param contentType a string representing the type
     * @param sliceSize the size of the slice for the blob
     * @returns a blob for downloading
     */
    const b64toBlob = function (b64Data: string, contentType: string, sliceSize: number): Blob {
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
        return new Blob(byteArrays, { type: contentType });
    };

    /**
     * @param id the id of the file
     * @param type 'process', 'predict'
     * @param watchType The type of watch to be downloaded
     */
    const handleDownload = async (
        id: string,
        type: DownloadType,
        watchType: WatchType,
    ): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await download(id, type, watchType);
            // response.file is an array of bytes
            if (!response.file) {
                return;
            }
            const fileBlob = b64toBlob(response.file, "application/octet-stream", 512);
            setIsDownloading(true);
            setErrorState(null);
            saveAs(fileBlob, `${watchType} ${id}.zip`);
        } catch (error) {
            setErrorState(`An error has occured while downloading a file: ${error.message}`);
        } finally {
            setIsLoading(false);
            setIsDownloading(false);
        }
    };

    return useMemo(
        () => ({
            handleDownload,
            isLoading,
            isDownloading,
            error: errorState,
        }),
        [isLoading, errorState],
    );
};

export default useDownload;
