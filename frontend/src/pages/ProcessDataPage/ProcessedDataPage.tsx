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
// import useDeleteFile from "shared/hooks/useDeleteFile";
// import { saveAs } from "file-saver";
import { FileWithPath } from "react-dropzone";
import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "dev",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Processed Data page");

  const [files, setFiles] = useState<any[]>([]);
  const [currentFile, setCurrentFile] = useState<any>();
  const [selectedModel, setSelectedModel] = useState<PredictionType>(
    PredictionType.SVM,
  );

  const { handlePredict } = usePredictedFile();
  // const { handleDelete } = useDeleteFile();

  // the list of radial selectors for the file list
  let renders: any;

  /**
   * This function will get the users processed files from the database
   * PRE-Conditions: User is logged in and authenticated
   * POST-Conditions: Files will be updated to be the users list of files
   *                  The list of displayed files will be updated to show this
   */
  const getUploadedFiles = () => {
    if (files.length === 0) {
      try {
        const { uploadedFiles } = useListUploadedFiles(WatchType.APPLE_WATCH);
        const transformData = uploadedFiles.map((file: RawFileData) => ({
          ...file,
          watch: DataType.APPLE_WATCH,
        }));
        setFiles([...files, ...transformData]);
      } catch (error: any) {
        rollbar.error(error);
        throw error;
      }
      try {
        const { uploadedFiles } = useListUploadedFiles(WatchType.APPLE_WATCH);
        const transformData = uploadedFiles.map((file: RawFileData) => ({
          ...file,
          watch: DataType.APPLE_WATCH,
        }));
        setFiles([...files, ...transformData]);
      } catch (error: any) {
        rollbar.error(error);
        throw error;
      }
    }
  };

  /**
   * sends the selected files to the predict R script
   * PRE-Conditions: A file is selected, and a prediction method is selected
   * POST-Conditions: Sends the files to the R repo and adds them to the database???
   */
  const predictFiles = async (event: React.MouseEvent) => {
    event.preventDefault();
    const { id, watch } = currentFile;
    const lowerCaseWatch = watch.toLowerCase();

    await handlePredict(id, selectedModel, lowerCaseWatch);
  };

  // /**
  //  * creates a blob for a file for download
  //  * @param b64Data the data to be downloaded
  //  * @param contentType a string representing the type
  //  * @param sliceSize the size of the slice for the blob
  //  * @returns a blob for downloading
  //  */
  // const b64toBlob = function (
  //   b64Data: string,
  //   contentType: string,
  //   sliceSize: number,
  // ) {
  //   // contentType = contentType || "";
  //   // sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];
  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i += 1) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }
  //   const blob = new Blob(byteArrays, { type: contentType });
  //   return blob;
  // };

  // /**
  //  * Downloads the currently selected file to the users computer
  //  */
  // const downloadFile = () => {
  //   const { id, watch } = currentFile;
  //   const lowerCaseWatch = watch.toLowerCase();
  //   watchService
  //     .download(id, "process", lowerCaseWatch)
  //     .then((response: any) => {
  //       const blob = b64toBlob(
  //         response.data.file,
  //         "application/octet-stream",
  //         512,
  //       );
  //       saveAs(blob, `${watch} ${id}.zip`);
  //     })
  //     .catch((err: Error) => {
  //       rollbar.error(err);
  //     });
  // };

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

  getUploadedFiles();

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
              onClick={predictFiles}
            >
              Predict File
            </Button>
            <Button
              variant="contained"
              className={styles.downloadBtn}
              // onClick={downloadFile}
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
