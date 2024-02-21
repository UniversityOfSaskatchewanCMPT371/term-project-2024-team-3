/* eslint-disable prefer-arrow-callback */

import React from "react";
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

import styles from "./ProcessedDataPage.module.css";

const ProcessedDataPage = function () {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Processed Data page");

  const getRendersOfFiles = (listOfFiles: Array<String>) => {
    const renders = listOfFiles.map(function (i: String) {
      console.log(i);
      return (
        <div className={styles.fileSelector}>
          <FormControlLabel
            value={i}
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
            label={i}
            labelPlacement="end"
          />
          <div className={styles.fileTextBox}>
            <text className={styles.fileDate}>{i}</text>
            <text className={styles.fileDate}>{i}</text>
          </div>
        </div>
      );
    });
    return renders;
  };

  const renders = getRendersOfFiles([
    "String 1",
    "String 2",
    "String 3",
    "This is also a string",
  ]);

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
