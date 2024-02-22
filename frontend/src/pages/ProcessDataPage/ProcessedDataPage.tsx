/* eslint-disable prefer-arrow-callback */

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
  // List,
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

  // the list of radial selectors for the file list
  let renders;

  /**
   *  Maps the list of files to a list of radial selectors for the files list
   */
  const getRendersOfFiles = () => {
    renders = files.map(function (i: FileWithPath) {
      const date = new Date(i.lastModified);

      return (
        <div className={styles.fileSelector}>
          <FormControlLabel
            value={i.name}
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
            label={i.name}
            labelPlacement="end"
          />
          <div className={styles.fileTextBox}>
            <div className={styles.fileDate}>{date.toDateString()}</div>
          </div>
        </div>
      );
    });
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
            <Button variant="contained" className={styles.predictBtn}>
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
