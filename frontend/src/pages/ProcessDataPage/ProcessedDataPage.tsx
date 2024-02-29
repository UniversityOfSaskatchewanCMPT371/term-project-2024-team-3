import React, { useState } from "react";
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Button,
  Container,
} from "@mui/material";
import {
  DataType,
  PredictionType,
  ProcessedFileData,
  WatchType,
} from "shared/api";
import useListProcessedFiles from "shared/hooks/useGetProcessedDataList";
import moment from "moment";
import usePredictedFile from "shared/hooks/usePredictFile";
// import useDeleteFile from "shared/hooks/useDeleteFile";
import { useRollbar } from "@rollbar/react";
import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
  const rollbar = useRollbar();
  rollbar.debug("Reached Processed Data page");

  const [currentFile, setCurrentFile] = useState<any>();
  const [selectedModel, setSelectedModel] = useState<PredictionType>(
    PredictionType.SVM,
  );

  const { handlePredict } = usePredictedFile();
  // const { handleDelete } = useDeleteFile();

  const { uploadedFiles: fitbitFiles } = useListProcessedFiles(
    WatchType.FITBIT,
  );
  const { uploadedFiles: appleWatchFiles } = useListProcessedFiles(
    WatchType.APPLE_WATCH,
  );

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
    if (currentFile) {
      const { id, watch } = currentFile;
      const lowerCaseWatch = watch.toLowerCase();
      handlePredict(id, selectedModel, lowerCaseWatch);
    }
  };

  /**
   * Downloads the currently selected file to the users computer
   */
  const downloadFile = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  /**
   * deletes a file
   * NOTE: The delete route in the back-end does not exist, but the hook works
   */
  const deleteFile = (event: React.MouseEvent) => {
    event.preventDefault();
    // if (currentFile) {
    //   const { id, watch } = currentFile;
    //   const lowerCaseWatch = watch.toLowerCase();
    //   handleDelete(id, lowerCaseWatch);
    // }
  };

  /**
   *  Maps the list of files to a list of radial selectors for the files list
   */
  const getRendersOfFiles = () => {
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
      <Container className={styles.containerDiv}>
        <div className={styles.action_bar}>
          <FormControl component="fieldset">
            <RadioGroup row defaultValue="svm">
              <FormControlLabel
                value="svm"
                onClick={() => setSelectedModel(PredictionType.SVM)}
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
                onClick={() => setSelectedModel(PredictionType.RANDOM_FOREST)}
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
                onClick={() => setSelectedModel(PredictionType.DECISSION_TREE)}
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
            <FormControl
              component="fieldset"
              className={styles.fileSelectorRad}
            >
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
              className={styles.goToPredicted}
              variant="contained"
              href="/PredictedDataPage"
              onClick={deleteFile}
              data-testid="Delete_Button"
            >
              DELETE FILE{" "}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default ProcessedDataPage;
