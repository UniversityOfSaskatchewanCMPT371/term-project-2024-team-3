import React, { useState, useEffect } from "react";
import { RadioGroup, FormControl, FormControlLabel, Radio, Button, Container } from "@mui/material";
import { DataType, PredictionType, ProcessedFileData, WatchType, DownloadType } from "shared/api";
import { ProgressBarType, ProgressBar } from "components/ProgressBar/ProgressBar";
import useGetProcessedDataList from "shared/hooks/useGetProcessedDataList";
import moment from "moment";
import usePredictFile from "shared/hooks/usePredictFile";
import useDownload from "shared/hooks/useDownload";
import { useRollbar } from "@rollbar/react";
import styles from "./ProcessedDataPage.module.css";

type ProcessedFile = ProcessedFileData & {
    watch: string;
};

const ProcessedDataPage = function () {
    const rollbar = useRollbar();

    const [currentFile, setCurrentFile] = useState<ProcessedFile>();
    const [selectedModel, setSelectedModel] = useState<PredictionType>(PredictionType.SVM);

    const [progressbar, setProgressbar] = useState<ProgressBarType>({
        percentage: 0,
        message: "N/A",
        isVisible: false,
    });

    // ensuring correct initialization of state.
    // console.assert(currentFile === undefined, "currentFile should be undefined initially");
    // console.assert(
    //     selectedModel === PredictionType.SVM,
    //     "selectedModel should be initialized to PredictionType.SVM",
    // );

    const { handlePredict, error: usePredictError } = usePredictFile();
    const { handleDownload, error: useDownloadError } = useDownload();

    const { uploadedFiles: fitbitFiles } = useGetProcessedDataList(WatchType.FITBIT);

    const { uploadedFiles: appleWatchFiles } = useGetProcessedDataList(WatchType.APPLE_WATCH);

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

    const handleModelChange = (model: PredictionType) => {
        // ensure that the selected model belongs to one of the acceptable types
        console.assert(
            model === PredictionType.SVM ||
                model === PredictionType.RANDOM_FOREST ||
                model === PredictionType.DECISSION_TREE,
            "Invalid prediction model selected",
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

    const files = fitbitProcessedFiles.concat(appleWatchProcessedFiles);

    // the list of radial selectors for the file list
    let renders: any;

    /**
     * sends the selected files to the predict R script
     * PRE-Conditions: A file is selected, and a prediction method is selected
     * POST-Conditions: Sends the files to the R repo and adds them to the database???
     */
    const predictFile = async (event: React.MouseEvent) => {
        event.preventDefault();
        // make sure a file is selected before you attempt to predict it
        console.assert(currentFile !== undefined, "A file should be selected before predicting");
        if (currentFile) {
            const { id, watch } = currentFile;
            const lowerCaseWatch = watch.toLowerCase();

            onProgressChange(30, "Your file is being predicted.", true);
            await handlePredict(id, selectedModel, lowerCaseWatch);
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
        // make sure a file is selected before you attempt to download it
        console.assert(currentFile !== undefined, "A file should be selected before downloading");
        if (currentFile) {
            const { id, watch } = currentFile;
            const stringID = id.toString();
            let watchType;
            if (watch === "AppleWatch") {
                watchType = WatchType.APPLE_WATCH;
            } else if (watch === "Fitbit") {
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

    /**
     *  Maps the list of files to a list of radial selectors for the files list
     *  Pre-conditions: files has at least one file in it
     *  Post-conditions: returns a list of formatted html components
     */
    const getRendersOfFiles = () => {
        console.assert(files.length > 0, "Files array should contain data for rendering");
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
                                label="Decission Tree"
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
                    </div>
                </div>
            </Container>
        </div>
    );
};
export default ProcessedDataPage;
