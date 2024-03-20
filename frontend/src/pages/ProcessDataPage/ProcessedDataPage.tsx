import React, { useState } from "react";
import { RadioGroup, FormControl, FormControlLabel, Radio, Button, Container } from "@mui/material";
import { DataType, PredictionType, ProcessedFileData, WatchType, DownloadType } from "shared/api";
// import ProgressBar from "components/ProgressBar/ProgressBar";
import useGetProcessedDataList from "shared/hooks/useGetProcessedDataList";
import moment from "moment";
import usePredictFile from "shared/hooks/usePredictFile";
import useDownload from "shared/hooks/useDownload";
import { useRollbar } from "@rollbar/react";
import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
    const rollbar = useRollbar();
    rollbar.info("Reached Processed Data page");

    const [currentFile, setCurrentFile] = useState<any>();
    const [selectedModel, setSelectedModel] = useState<PredictionType>(PredictionType.SVM);

    // ensuring correct initialization of state.
    console.assert(currentFile === undefined, "currentFile should be undefined initially");
    console.assert(
        selectedModel === PredictionType.SVM,
        "selectedModel should be initialized to PredictionType.SVM",
    );

    const { handlePredict, error: usePredictError } = usePredictFile();
    const { handleDownload, error: useDownloadError } = useDownload();

    const { uploadedFiles: fitbitFiles } = useGetProcessedDataList(WatchType.FITBIT);

    const { uploadedFiles: appleWatchFiles } = useGetProcessedDataList(WatchType.APPLE_WATCH);

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
            handlePredict(id, selectedModel, lowerCaseWatch);
            if (usePredictError) {
                rollbar.error(usePredictError);
            }
        }
    };

    /**
     * Pre-conditions: A file is selected
     * Post-conditions: Downloads the currently selected file to the users computer
     */
    const downloadFile = (event: React.MouseEvent) => {
        event.preventDefault();
        // make sure a file is selected before you attempt to download it
        console.assert(currentFile !== undefined, "A file should be selected before downloading");
        if (currentFile) {
            const { id, watch } = currentFile;
            const stringID = id.toString();
            handleDownload(stringID, DownloadType.PROCESS, watch);
            if (useDownloadError) {
                rollbar.error(useDownloadError);
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
        renders = files.map((file: ProcessedFileData) => {
            const date = moment(file.dateTime ?? "");
            let dateString;

            if (date.isValid()) {
                dateString = date.format("YYYY/MM/DD");
            } else {
                dateString = "N/A";
            }

            return (
                <div className={styles.fileSelector}>
                    <FormControlLabel
                        value={file.id}
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
                        label={file.id.toString()}
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
            {/* <ProgressBar percentage={20} /> */}
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
