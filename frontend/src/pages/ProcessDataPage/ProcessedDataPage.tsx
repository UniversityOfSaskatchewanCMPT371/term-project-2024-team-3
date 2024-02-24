/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { FileWithPath } from "react-dropzone";
import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Processed Data page");

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [currentFile, setCurrentFile] = useState<FileWithPath>();
  const [selectedModel, setSelectedModel] = useState<String>("svm");
  // the list of radial selectors for the file list
  let renders;

  /**
   * This function will get the users processed files from the database
   * PRE-Conditions: User is logged in and authenticated
   * POST-Conditions: Files will be updated to be the users list of files
   *                  The list of displayed files will be updated to show this
   */
  const getProcessedFiles = () => {};

  /**
   * Downloads the currently selected file to the users computer
   */
  const downloadFile = () => {};

  /**
   * sends the selected files to the predict R script
   * PRE-Conditions: A file is selected, and a prediction method is selected
   * POST-Conditions: Sends the files to the R repo and adds them to the database???
   */
  const predictFiles = () => {};

  /**
   *  Maps the list of files to a list of radial selectors for the files list
   */
  const getRendersOfFiles = () => {
    renders = files.map((file: FileWithPath) => {
      const date = new Date(file.lastModified);

      return (
        <div className={styles.fileSelector}>
          <FormControlLabel
            value={file.name}
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
            label={file.name}
            labelPlacement="end"
          />
          <div className={styles.fileTextBox}>
            <div className={styles.fileDate}>{date.toDateString()}</div>
          </div>
        </div>
      );
    });
  };

  /**
   *
   */
  const predictFile = () => {
    console.log(selectedModel);
    console.log(currentFile);
  };

  // TEST DATA //
  const file = new File([], "../ProcessedDataPage.test.tsx");
  const file2 = new File([], "../ProcessedDataPage.tsx");
  const file3 = new File(
    [],
    "../../PredictedDataPage/PredoctedDataPage.module.css",
  );

  if (files.length === 0) {
    setFiles([file, file2, file3]);
  }

  getRendersOfFiles();

  return (
    <div>
      <Container className={styles.containerDiv}>
        <div className={styles.action_bar}>
          <FormControl component="fieldset">
            <RadioGroup row defaultValue="svm">
              <FormControlLabel
                value="svm"
                onClick={() => setSelectedModel("svm")}
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
                onClick={() => setSelectedModel("randomForest")}
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
                onClick={() => setSelectedModel("decisionTree")}
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
              onClick={() => predictFile()}
            >
              Predict File
            </Button>
            <Button variant="contained" className={styles.downloadBtn}>
              Download File
            </Button>
            <Button
              className={styles.goToPredicted}
              variant="contained"
              href="/PredictedDataPage"
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
