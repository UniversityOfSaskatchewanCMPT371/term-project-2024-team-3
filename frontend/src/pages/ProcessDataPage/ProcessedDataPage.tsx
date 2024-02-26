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
import { saveAs } from "file-saver";

import { FileWithPath } from "react-dropzone";

// issues here
import WatchService from "../../shared/Data";

import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Processed Data page");

  const [files, setFiles] = useState<any[]>([]);
  const [currentFile, setCurrentFile] = useState<any>();
  const [selectedModel, setSelectedModel] = useState<string>("svm");

  const watchService = new WatchService();

  // the list of radial selectors for the file list
  let renders;

  /**
   * This function will get the users processed files from the database
   * PRE-Conditions: User is logged in and authenticated
   * POST-Conditions: Files will be updated to be the users list of files
   *                  The list of displayed files will be updated to show this
   */

  // async
  const getProcessedFiles = () => {
    // await
    watchService
      .getProcessedDataList("fitbit")
      .then(({ data, status }) => {
        if (status !== 200) {
          throw Error(data.message);
        }
        const transformData = [...data.list].map((file: File) => ({
          ...file,
          watch: "Fitbit",
        }));
        setFiles([...files, ...transformData]);
      })
      .catch((err: Error) => {
        rollbar.error(err);
      });
    // await
    watchService
      .getProcessedDataList("applewatch")
      .then(({ data, status }) => {
        if (status !== 200) {
          throw Error(data.message);
        }
        const transformData = [...data.list].map((file: File) => ({
          ...file,
          watch: "AppleWatch",
        }));
        setFiles([...files, ...transformData]);
      })
      .catch((err: Error) => {
        rollbar.error(err);
      });
  };

  /**
   * sends the selected files to the predict R script
   * PRE-Conditions: A file is selected, and a prediction method is selected
   * POST-Conditions: Sends the files to the R repo and adds them to the database???
   */
  const predictFiles = () => {
    const { id, watch } = currentFile;
    const lowerCaseWatch = watch.toLowerCase();
    watchService
      .predict(id, selectedModel, lowerCaseWatch)
      .then((response: any) => {
        if (response.status !== 200) {
          throw new Error(response.data.message);
        }
      })
      .catch((err: Error) => {
        rollbar.error(err);
      });
  };

  /**
   * creates a blob for a file for download
   * @param b64Data the data to be downloaded
   * @param contentType a string representing the type
   * @param sliceSize the size of the slice for the blob
   * @returns a blob for downloading
   */
  const b64toBlob = function (
    b64Data: string,
    contentType: string,
    sliceSize: number,
  ) {
    // contentType = contentType || "";
    // sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise
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
   * Downloads the currently selected file to the users computer
   */
  const downloadFile = () => {
    const { id, watch } = currentFile;
    const lowerCaseWatch = watch.toLowerCase();
    watchService
      .download(id, "process", lowerCaseWatch)
      .then((response: any) => {
        const blob = b64toBlob(
          response.data.file,
          "application/octet-stream",
          512,
        );
        saveAs(blob, `${watch} ${id}.zip`);
      })
      .catch((err: Error) => {
        rollbar.error(err);
      });
  };

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

  // // TEST DATA //
  // const file = new File([], "../ProcessedDataPage.test.tsx");
  // const file2 = new File([], "../ProcessedDataPage.tsx");
  // const file3 = new File(
  //   [],
  //   "../../PredictedDataPage/PredoctedDataPage.module.css",
  // );

  // if (files.length === 0) {
  //   setFiles([file, file2, file3]);
  // }

  getProcessedFiles();

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
              onClick={predictFiles}
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
