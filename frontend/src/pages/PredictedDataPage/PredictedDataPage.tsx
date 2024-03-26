import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import { useRollbar } from "@rollbar/react";
import { DownloadType, FileData, WatchType } from "shared/api";
import moment from "moment";
// import useGetPredictedDataList from "shared/hooks/useGetPredictedDataList";
import useDownload from "shared/hooks/useDownload";
import styles from "./PredictedDataPage.module.css";

type PredictedFileWithType = FileData & { watch: WatchType; name: string };

const PredictedDataPage = function () {
    const rollbar = useRollbar();
    rollbar.info("Reached Predicted Data page");

    // #TODO make pretty
    // #TODO write tests

    const { handleDownload, error: useDownloadError } = useDownload();
    const [checked, setChecked] = useState<Array<number>>([]);
    const [isDownloadButtonDisabled, setIsDownloadButtonDisabled] = useState<boolean>(true);
    let availableFiles: Array<PredictedFileWithType> = [];
    const setAvailableFiles = (arr: Array<PredictedFileWithType>) => {
        availableFiles = [];
        arr.forEach((file) => availableFiles.push(file));
    };

    /**
     * Handles check/un-check of items in file list
     * @param value the index of files in the list of avaliable files
     * Pre-conditions: There is at least one file in the list of avaliable files
     * Post-conditions: The selected file is added to the list of checked files
     */
    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        const filename = availableFiles[value].name;
        console.log(value);
        console.log(filename);

        // adding to checked list
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);

        if (newChecked.length > 0) {
            setIsDownloadButtonDisabled(false); // enable download button when at least one file is selected
        } else {
            setIsDownloadButtonDisabled(true);
        } // disable otherwise
    };

    const getAvailableFiles = (): Array<PredictedFileWithType> => {
        // #region Real Data
        // const { uploadedFiles: fitBitFiles, error: predictedFitbitError } = useGetPredictedDataList(
        //     WatchType.FITBIT,
        // );
        // if (predictedFitbitError) {
        //     rollbar.error(predictedFitbitError.toString());
        // }

        // const { uploadedFiles: appleWatchFiles, error: predictedAppleError } =
        //     useGetPredictedDataList(WatchType.APPLE_WATCH);
        // if (predictedAppleError) {
        //     rollbar.error(predictedAppleError.toString());
        // }
        // #endregion

        // #region Mock Data
        const fitBitFiles = [
            // mock data
            {
                id: 123,
                data: new Uint8Array([1, 2]),
                predictionType: null,
                dateTime: new Date(),
            },
            {
                id: 456,
                data: new Uint8Array([5, 6]),
                predictionType: null,
                dateTime: new Date(),
            },
        ];

        const appleWatchFiles = [
            {
                id: 123,
                data: new Uint8Array([1, 2]),
                predictionType: null,
                dateTime: new Date(),
            },
            {
                id: 456,
                data: new Uint8Array([5, 6]),
                predictionType: null,
                dateTime: new Date(),
            },
        ];
        // #endregion

        const appleWatchPredictedFiles: Array<PredictedFileWithType> =
            appleWatchFiles?.length !== 0
                ? appleWatchFiles.map((file: FileData) => ({
                      ...file,
                      watch: WatchType.APPLE_WATCH,
                      name: `${WatchType.APPLE_WATCH} ${file.id.toString()}`,
                  }))
                : [];

        const fitbitPredictedFiles: Array<PredictedFileWithType> =
            fitBitFiles?.length !== 0
                ? fitBitFiles.map((file: FileData) => ({
                      ...file,
                      watch: WatchType.FITBIT,
                      name: `${WatchType.FITBIT} ${file.id.toString()}`,
                  }))
                : [];

        return appleWatchPredictedFiles.concat(fitbitPredictedFiles);
    };

    setAvailableFiles(getAvailableFiles());

    /**
     * Request available files list from API
     */
    const refreshAvailableFiles = () => {
        setAvailableFiles(getAvailableFiles());
    };

    /**
     * Method Called by Refresh Button
     */
    const refreshFileList = () => {
        refreshAvailableFiles();
        setIsDownloadButtonDisabled(true);
        setChecked([]);
    };

    /**
     * Pre-conditions: A file is selected
     * Post-conditions: Downloads the currently selected files to the users computer
     */
    const downloadFiles = (event: React.MouseEvent) => {
        event.preventDefault();

        // make sure at least one file is selected before you attempt to download it

        checked.forEach((i) => {
            const { id, watch } = availableFiles[i];
            const stringID = id.toString();
            handleDownload(stringID, DownloadType.PREDICT, watch);

            if (useDownloadError) {
                rollbar.error(useDownloadError);
            }
        });
    };

    /**
     * map avaliable files to html list items
     */
    const availableFilesDisplay =
        availableFiles.length > 0 ? (
            availableFiles.map((file, i) => (
                <ListItem
                    key={file.id.toString()}
                    style={{ paddingTop: "0px", paddingBottom: "0px", cursor: "pointer" }}
                    onClick={handleToggle(i)}
                    dense
                >
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={checked.indexOf(i) !== -1}
                            tabIndex={-1}
                            disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText primary={`${file.watch} - ${file.id}`} />
                    {file.dateTime ? (
                        <ListItemText
                            primary={moment(file.dateTime).format("ddd, D MMM YYYY, hh:mm:ss A")}
                        />
                    ) : (
                        ""
                    )}
                </ListItem>
            ))
        ) : (
            <ListItem className={styles.list} style={{ marginTop: "15px" }}>
                No files
            </ListItem>
        );

    const selectedFileListDisplay =
        checked.length > 0
            ? checked.map((i) => {
                  const filename = availableFiles[i].name;
                  return <li>{filename}</li>;
              })
            : "";

    return (
        <div>
            <Container className={styles.container}>
                <div className={styles.bannerinfo}>
                    <strong>Step 3 - Predicted data files: </strong>
                    <span>
                        On this page, you can download your new data files with both the raw Apple
                        Watch or Fitbit data, the features we use for our machine learning models,
                        and the predicted activity for each minute of your data.
                    </span>
                </div>
                <div className={styles.container}>
                    <h1>Files: </h1>
                    <div>
                        <Button
                            variant="contained"
                            onClick={downloadFiles}
                            className={styles.downloadBtn}
                            disabled={isDownloadButtonDisabled}
                            data-testid="Download_Button"
                        >
                            Download File(s)
                        </Button>
                        <Button
                            variant="contained"
                            onClick={refreshFileList}
                            className={styles.predictBtn}
                            data-testid="Refresh_Button"
                        >
                            Refresh List
                        </Button>
                    </div>
                </div>

                {/* Predicted Files List  */}
                <List className={styles.list}>{availableFilesDisplay}</List>

                <div className={styles.bannerinfo}>
                    <span>
                        If you want to upload different files, go back to the file upload page. You
                        can also click on individual steps to rerun a different machine learning
                        model if you want.
                    </span>
                </div>
                <div>
                    <ul>{selectedFileListDisplay}</ul>
                </div>
            </Container>
        </div>
    );
};

export default PredictedDataPage;
