import React, { useState } from "react";
import Rollbar from "rollbar";
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import { DataType, PredictionType, RawFileData, WatchType } from "shared/api";
import useListUploadedFiles from "shared/hooks/useListUploadedFiles";
import usePredictedFile from "shared/hooks/usePredictFile";
import useDeleteFile from "shared/hooks/useDeleteFile";
import useDownload from "shared/hooks/useDownload";
import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "dev",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Processed Data page");

  const [currentFile, setCurrentFile] = useState<any>();
  const [selectedModel, setSelectedModel] = useState<PredictionType>(
    PredictionType.SVM,
  );

  const { handlePredict } = usePredictedFile();
  const { handleDownload } = useDownload();
  const { handleDelete } = useDeleteFile();

  const { uploadedFiles } = useListUploadedFiles(WatchType.FITBIT);

  const files =
    uploadedFiles?.length !== 0
      ? uploadedFiles.map((file: RawFileData) => ({
          ...file,
          watch: DataType.FITBIT,
        }))
      : [];

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
      await handlePredict(id, selectedModel, lowerCaseWatch);
    }
  };

  /**
   * Downloads the currently selected file to the users computer
   */
  const downloadFile = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentFile) {
      const { id, watch } = currentFile;
      const lowerCaseWatch = watch.toLowerCase();
      handleDownload(id, "process", lowerCaseWatch);
    }
  };

  const deleteFile = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentFile) {
      const { id, watch } = currentFile;
      const lowerCaseWatch = watch.toLowerCase();
      handleDelete(id, lowerCaseWatch);
    }
  };

  /**
   *  Maps the list of files to a list of radial selectors for the files list
   */
  const getRendersOfFiles = () => {
    renders = files.map((file: RawFileData) => {
      const date = file.dateTime;

      let dateString;

      if (date !== null) {
        dateString = date.toDateString();
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
                label="SVM"
                labelPlacement="end"
              />
              <FormControlLabel
                value="randomForest"
                onClick={() => setSelectedModel(PredictionType.RANDOM_FOREST)}
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
                label="Random Forest"
                labelPlacement="end"
              />
              <FormControlLabel
                value="decissionTree"
                onClick={() => setSelectedModel(PredictionType.DECISSION_TREE)}
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
                label="Decission Tree"
                labelPlacement="end"
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
            >
              Predict File
            </Button>
            <Button
              variant="contained"
              className={styles.downloadBtn}
              onClick={downloadFile}
            >
              Download File
            </Button>
            <Button
              className={styles.goToPredicted}
              variant="contained"
              href="/PredictedDataPage"
              onClick={deleteFile}
            >
              DELETE FILE{" "}
            </Button>
          </div>
        </div>
      </Container>

      <Snackbar>
        <Alert />
      </Snackbar>
    </div>
  );
};
export default ProcessedDataPage;
