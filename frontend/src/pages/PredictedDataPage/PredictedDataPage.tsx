import React, { useState, useEffect } from "react";
import {
    RadioGroup,
    FormControl,
    FormControlLabel,
    Radio,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    // Alert,
} from "@mui/material";
import { DataType, WatchType, DownloadType, FileData } from "shared/api";
import { ProgressBarType, ProgressBar } from "components/ProgressBar/ProgressBar";
import ErrorSnackbar from "components/ErrorSnackbar/ErrorSnackbar";
// import assert from "shared/util/assert";
import moment from "moment";
import useDownload from "shared/hooks/useDownload";
import { useRollbar } from "@rollbar/react";
import styles from "./PredictedDataPage.module.css";
import useGetPredictedDataList from "../../shared/hooks/useGetPredictedDataList";

type PredictedFile = FileData & {
    watch: string;
};

const PredictedDataPage = function () {
    const rollbar = useRollbar();

    const [currentFile, setCurrentFile] = useState<PredictedFile>();
    const [removedFiles, setRemovedFiles] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [progressbar, setProgressbar] = useState<ProgressBarType>({
        percentage: 0,
        message: "N/A",
        isVisible: false,
    });

    const { handleDownload, error: useDownloadError } = useDownload();

    const { uploadedFiles: fitbitFiles } = useGetPredictedDataList(WatchType.FITBIT);

    const { uploadedFiles: appleWatchFiles } = useGetPredictedDataList(WatchType.APPLE_WATCH);
    useEffect(() => {
        // Retrieve deleted files from localStorage
        const storedRemovedFiles = localStorage.getItem("removedFiles");
        if (storedRemovedFiles) {
            setRemovedFiles(new Set(JSON.parse(storedRemovedFiles)));
        }
    }, []);

    /**
     * handles progress bar change
     * @param percentage the percentage for progress bar
     * @param message the message to display on the progress bar
     * @param isVisible a boolean for whether the progress bar is visible or not
     */
    const onProgressChange = (percentage: number, message: string, isVisible: boolean) => {
        if (percentage >= 100) {
            setProgressbar({
                percentage,
                message,
                isVisible: true,
            });
            setTimeout(() => {
                setProgressbar({
                    percentage,
                    message,
                    isVisible: false,
                });
            }, 2000);
        } else {
            setProgressbar({
                percentage,
                message,
                isVisible,
            });
        }
    };

    useEffect(() => {
        rollbar.info("Reached Predicted Data page");

        if (useDownloadError && progressbar.isVisible) {
            onProgressChange(100, `An Error Occured! ${useDownloadError}`, true);
        }
    }, [useDownloadError, progressbar]);

    const appleWatchProcessedFiles =
        appleWatchFiles?.length !== 0
            ? appleWatchFiles.map((file: FileData) => ({
                  ...file,
                  watch: DataType.APPLE_WATCH,
              }))
            : [];

    const fitbitProcessedFiles =
        fitbitFiles?.length !== 0
            ? fitbitFiles.map((file: FileData) => ({
                  ...file,
                  watch: DataType.FITBIT,
              }))
            : [];
    const files = fitbitProcessedFiles
        .concat(appleWatchProcessedFiles)
        .filter((file) => !removedFiles.has(file.id.toString())); // Convert file.id to string

    // the list of radial selectors for the file list
    let renders: any;

    /**
     * Pre-conditions: A file is selected
     * Post-conditions: Downloads the currently selected file to the users computer
     */
    const downloadFile = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (currentFile) {
            const { id, watch } = currentFile;
            const stringID = id.toString();
            let watchType;
            if (watch === DataType.APPLE_WATCH) {
                watchType = WatchType.APPLE_WATCH;
            } else if (watch === DataType.FITBIT) {
                watchType = WatchType.FITBIT;
            }

            if (watchType === undefined) {
                rollbar.error("Incorrect watch type for download");
            } else {
                onProgressChange(30, "Your file is being downloaded.", true);
                await handleDownload(stringID, DownloadType.PREDICT, watchType);
                onProgressChange(100, "Your file has been downloaded!", true);

                if (useDownloadError) {
                    rollbar.error(useDownloadError);
                }
            }
        }
    };

    /**
     *  Maps the list of files to a list of radial selectors for the files list
     *  Pre-conditions: files has at least one file in it
     *  Post-conditions: returns a list of formatted html components
     */
    const getRendersOfFiles = () => {
        renders = files.map((file: PredictedFile) => {
            const date = moment(file.dateTime ?? "");
            let dateString;

            const { id, watch } = file;

            if (date.isValid()) {
                dateString = date.format("YYYY/MM/DD");
            } else {
                dateString = "N/A";
            }

            return (
                <div className={styles.fileSelector}>
                    <FormControlLabel
                        value={id}
                        onClick={() => setCurrentFile(file)}
                        control={
                            <Radio
                                color="primary"
                                sx={{
                                    "&, &.Mui-checked": {
                                        color: "#5FCED3",
                                    },
                                }}
                            />
                        }
                        label={`${watch} ${id.toString()}`}
                        labelPlacement="end"
                    />
                    <div className={styles.fileTextBox}>
                        <div className={styles.fileDate}>{dateString}</div>
                    </div>
                </div>
            );
        });
    };

    getRendersOfFiles();
    const deleteFile = () => {
        if (currentFile) {
            const { id } = currentFile;

            // Update local state
            setRemovedFiles((prev) => {
                const updatedSet = new Set(prev).add(id.toString());

                // Persist the updated set to localStorage
                localStorage.setItem("removedFiles", JSON.stringify(Array.from(updatedSet)));

                return updatedSet;
            });

            // Deselect the current file
            setCurrentFile(undefined);
        }
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        deleteFile();
        setDeleteDialogOpen(false);
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    return (
        <>
            <ProgressBar
                percentage={progressbar.percentage}
                message={progressbar.message}
                isVisible={progressbar.isVisible}
            />
            <Container sx={{ marginTop: 6 }}>
                <ErrorSnackbar error={useDownloadError} />

                <Container className={styles.containerDiv}>
                    {/* <Alert severity="info" sx={{ marginBottom: 3 }} data-testid="page-info">
                        On this page, you can download your new data files with both the raw Apple
                        Watch or Fitbit data, the features we use for our machine learning models,
                        and the predicted activity for each minute of your data. If you want to
                        upload different files, go back to the file upload page. You can also click
                        on individual steps to rerun a different machine learning model.
                    </Alert> */}
                    <div className={styles.columnDiv}>
                        <div className={styles.listDiv}>
                            <FormControl component="fieldset" className={styles.fileSelectorRad}>
                                <RadioGroup>{renders}</RadioGroup>
                            </FormControl>
                        </div>
                        <div className={styles.buttonControl}>
                            <Button
                                variant="contained"
                                className={styles.downloadBtn}
                                onClick={downloadFile}
                                data-testid="Download_Button"
                            >
                                Download File
                            </Button>
                            <Button
                                variant="contained"
                                className={styles.deleteBtn}
                                onClick={handleDelete}
                                data-testid="Delete_Button"
                            >
                                Delete File
                            </Button>
                        </div>
                    </div>
                </Container>
                {/* Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to permanently delete the selected files?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className={`${styles.cancelBtn}`}
                            onClick={cancelDelete}
                            data-testid="cancelBtn"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            className={`${styles.confirmBtn}`}
                            autoFocus
                            data-testid="confirmBtn"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};
export default PredictedDataPage;
