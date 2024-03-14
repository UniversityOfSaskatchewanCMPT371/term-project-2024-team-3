import React, { useState } from "react";
import { Button, Container, List } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import { FileData, WatchType } from "shared/api";
import useGetPredictedDataList from "shared/hooks/useGetPredictedDataList";
import styles from "./PredictedDataPage.module.css";

type PredictedFileWithType = FileData & { watch: WatchType; name: String };

const PredictedDataPage = function () {
    const rollbar = useRollbar();
    rollbar.debug("Reached Predicted Data page");

    const [availableFiles, setAvailableFilesDisplay] = useState<Array<PredictedFileWithType>>([]); // we need filetype (to know which service) and id

    const { uploadedFiles: fitbitFiles } = useGetPredictedDataList(WatchType.FITBIT); // assume this works. Maybe we can mock it for test
    const { uploadedFiles: appleWatchFiles } = useGetPredictedDataList(WatchType.APPLE_WATCH);

    const appleWatchPredictedFiles =
        appleWatchFiles?.length !== 0
            ? appleWatchFiles.map((file: FileData) => ({
                  ...file,
                  watch: WatchType.APPLE_WATCH,
                  name: `${WatchType.APPLE_WATCH} ${file.id.toString()}`,
              }))
            : [];

    const fitbitPredictedFiles =
        fitbitFiles?.length !== 0
            ? fitbitFiles.map((file: FileData) => ({
                  ...file,
                  watch: WatchType.FITBIT,
                  name: `${WatchType.FITBIT} ${file.id.toString()}`,
              }))
            : [];

    setAvailableFilesDisplay([
        ...availableFiles,
        ...fitbitPredictedFiles,
        ...appleWatchPredictedFiles,
    ]);

    const availableFilesDisplay = availableFiles.map((file) => <li>{file.name} </li>);

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
                <div>
                    <ul>{availableFilesDisplay}</ul>
                </div>
                <div className={styles.container}>
                    <h1>Files: </h1>
                    <div>
                        <Button variant="contained" className={styles.downloadBtn}>
                            Download File(s)
                        </Button>
                        <Button
                            variant="contained"
                            // onClick={refreshFileList}
                            className={styles.predictBtn}
                            // data-testid="Refresh_Button"
                        >
                            Refresh List
                        </Button>
                    </div>
                </div>
                <List className={styles.list} />
                <div className={styles.bannerinfo}>
                    <span>
                        If you want to upload different files, go back to the file upload page. You
                        can also click on individual steps to rerun a different machine learning
                        model if you want.
                    </span>
                </div>
            </Container>
        </div>
    );
};

export default PredictedDataPage;
