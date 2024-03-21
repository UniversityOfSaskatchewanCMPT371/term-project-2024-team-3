import { useState, useMemo } from "react";
import { saveAs } from "file-saver";
import { useRollbar } from "@rollbar/react";
import { download } from "../Data/index";
import { WatchType, DownloadType } from "../api";

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
    const rollbar = useRollbar();

    /**
     * creates a blob for a file for download
     * @param b64Data the data to be downloaded
     * @param contentType a string representing the type
     * @param sliceSize the size of the slice for the blob
     * @returns a blob for downloading
     */
    const b64toBlob = function (b64Data: string, contentType: string, sliceSize: number) {
        // contentType = contentType || "";
        // sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise
        rollbar.debug("blobbing files for data download");
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

    /**
     *
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
        const downloadInfoMsg = `Download request for ${type}ed file with id ${id} and watch type ${watchType}`;
        try {
            rollbar.info(`${downloadInfoMsg} sent.`);
            await download(id, type, watchType).then((response: any) => {
                // response.data.file is an array of bytes
                const blob = b64toBlob(response.data.file, "application/octet-stream", 512);
                setIsDownloading(true);
                saveAs(blob, `${watchType} ${id}.zip`);
            });
            rollbar.info(`${downloadInfoMsg} completed with no errors.`);
            setErrorState(null);
        } catch (error) {
            setErrorState(`An error has occured while downloading a file: ${error}`);
            rollbar.debug(`${downloadInfoMsg} failed.`);
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
