import React, { useState, useEffect } from "react";
import {
    RadioGroup,
    FormControl,
    FormControlLabel,
    Radio,
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { DataType, PredictionType, ProcessedFileData, WatchType, DownloadType } from "shared/api";
import { ProgressBarType, ProgressBar } from "components/ProgressBar/ProgressBar";
import ErrorSnackbar from "components/ErrorSnackbar/ErrorSnackbar";
import useGetProcessedDataList from "shared/hooks/useGetProcessedDataList";
import moment from "moment";
import usePredictFile from "shared/hooks/usePredictFile";
import useDownload from "shared/hooks/useDownload";
import assert from "shared/util/assert";
import { useRollbar } from "@rollbar/react";
import styles from "./ProcessedDataPage.module.css";

type ProcessedFile = ProcessedFileData & {
    watch: string;
};

const ProcessedDataPage = function () {
    const rollbar = useRollbar();

    const [currentFile, setCurrentFile] = useState<ProcessedFile>();
    const [removedFiles, setRemovedFiles] = useState<Set<Number>>(new Set());
    const [selectedModel, setSelectedModel] = useState<PredictionType>(PredictionType.SVM);

    const [progressbar, setProgressbar] = useState<ProgressBarType>({
        percentage: 0,
        message: "N/A",
        isVisible: false,
    });

    const { handlePredict, error: usePredictError } = usePredictFile();
    const { handleDownload, error: useDownloadError } = useDownload();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { uploadedFiles: fitbitFiles, error: fitBitListError } = useGetProcessedDataList(
        WatchType.FITBIT,
    );

    const { uploadedFiles: appleWatchFiles, error: appleWatchFilesError } = useGetProcessedDataList(
        WatchType.APPLE_WATCH,
    );

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
        rollbar.info("Reached Processed Data page");

        if (useDownloadError && progressbar.isVisible) {
            onProgressChange(100, `An Error Occured! ${useDownloadError}`, true);
        }
        if (usePredictError && progressbar.isVisible) {
            onProgressChange(100, `An Error Occured! ${usePredictError}`, true);
        }
    }, [useDownloadError, usePredictError, progressbar]);

    useEffect(() => {
        // Retrieve deleted files from localStorage
        const storedRemovedFiles = localStorage.getItem("removedFiles");
        if (storedRemovedFiles) {
            setRemovedFiles(new Set(JSON.parse(storedRemovedFiles)));
        }
    }, []);

    const handleModelChange = (model: PredictionType) => {
        // ensure that the selected model belongs to one of the acceptable types
        assert(
            model === PredictionType.SVM ||
                model === PredictionType.RANDOM_FOREST ||
                model === PredictionType.DECISSION_TREE,
            "Invalid prediction model selected",
            rollbar,
        );
        setSelectedModel(model);
    };

    const appleWatchProcessedFiles =
        appleWatchFiles?.length !== 0
            ? appleWatchFiles.map((file: ProcessedFileData) => ({
                  ...file,
                  watch: DataType.APPLE_WATCH,
              }))
            : [];

    const fitbitProcessedFiles =
        fitbitFiles?.length !== 0
            ? fitbitFiles.map((file: ProcessedFileData) => ({
                  ...file,
                  watch: DataType.FITBIT,
              }))
            : [];

    const files = fitbitProcessedFiles
        .concat(appleWatchProcessedFiles)
        .filter((file) => !removedFiles.has(file.id)); // Filter out removed files

    // the list of radial selectors for the file list
    let renders: any;

    /**
     * sends the selected files to the predict R script
     * PRE-Conditions: A file is selected, and a prediction method is selected
     * POST-Conditions: Sends the files to the R repo and adds them to the database???
     */
    const predictFile = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (currentFile) {
            const { id, watch } = currentFile;
            const lowerCaseWatch = watch.toLowerCase();
            let predictWatch = WatchType.FITBIT;

            onProgressChange(30, "Your file is being predicted.", true);
            if (lowerCaseWatch === WatchType.APPLE_WATCH) {
                predictWatch = WatchType.APPLE_WATCH;
            }

            await handlePredict(id.toString(), selectedModel, predictWatch);
            onProgressChange(100, "Your file has been predicted!", true);

            if (usePredictError) {
                rollbar.error(usePredictError);
            }
        }
    };

    /**
     * Pre-conditions: A file is selected
     * Post-conditions: Downloads the currently selected file to the users computer
     */
    const downloadFile = async (event: React.MouseEvent) => {
        event.preventDefault();
        assert(currentFile, "a file is not selected", rollbar);
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
                await handleDownload(stringID, DownloadType.PROCESS, watchType);
                onProgressChange(100, "Your file has been downloaded!", true);

                if (useDownloadError) {
                    rollbar.error(useDownloadError);
                }
            }
        }
    };

    const deleteFile = () => {
        if (currentFile) {
            const { id } = currentFile;

            // Update local state
            setRemovedFiles((prev) => {
                const updatedSet = new Set(prev).add(id);

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

    /**
     *  Maps the list of files to a list of radial selectors for the files list
     *  Pre-conditions: files has at least one file in it
     *  Post-conditions: returns a list of formatted html components
     */
    const getRendersOfFiles = () => {
        renders = files.map((file: ProcessedFile) => {
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

    return (
        <div>
            <ProgressBar
                percentage={progressbar.percentage}
                message={progressbar.message}
                isVisible={progressbar.isVisible}
            />

            <ErrorSnackbar error={usePredictError} />
            <ErrorSnackbar error={useDownloadError} />
            <ErrorSnackbar error={fitBitListError} />
            <ErrorSnackbar error={appleWatchFilesError} />

            <Container className={styles.containerDiv}>
                <div className={styles.action_bar}>
                    <FormControl component="fieldset">
                        <RadioGroup row defaultValue="svm">
                            <FormControlLabel
                                value="svm"
                                onClick={() => handleModelChange(PredictionType.SVM)}
                                label="SVM"
                                labelPlacement="end"
                                control={
                                    <Radio
                                        color="primary"
                                        sx={{
                                            "&, &.Mui-checked": {
                                                color: "#5FCED3",
                                            },
                                        }}
                                        data-testid="SVM_Radial"
                                    />
                                }
                            />
                            <FormControlLabel
                                value="randomForest"
                                onClick={() => handleModelChange(PredictionType.RANDOM_FOREST)}
                                label="Random Forest"
                                labelPlacement="end"
                                control={
                                    <Radio
                                        color="primary"
                                        sx={{
                                            "&, &.Mui-checked": {
                                                color: "#5FCED3",
                                            },
                                        }}
                                        data-testid="RandomForest_Radial"
                                    />
                                }
                            />
                            <FormControlLabel
                                value="decissionTree"
                                onClick={() => handleModelChange(PredictionType.DECISSION_TREE)}
                                label="Decision Tree"
                                labelPlacement="end"
                                control={
                                    <Radio
                                        color="primary"
                                        sx={{
                                            "&, &.Mui-checked": {
                                                color: "#5FCED3",
                                            },
                                        }}
                                        data-testid="DecissionTree_Radial"
                                    />
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className={styles.columnDiv}>
                    <div className={styles.listDiv}>
                        <FormControl component="fieldset" className={styles.fileSelectorRad}>
                            <RadioGroup>{renders}</RadioGroup>
                        </FormControl>
                    </div>
                    <div className={styles.buttonControl}>
                        <Button
                            variant="contained"
                            className={styles.predictBtn}
                            onClick={predictFile}
                            data-testid="Predict_Button"
                        >
                            Predict File
                        </Button>
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
        </div>
    );
};
export default ProcessedDataPage;
