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
  List,
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

  return (
    <div>
      <Container className={styles.containerDiv}>
        <div className={styles.bannerinfo}>
          <strong>Step 2 - Data prediction and download: </strong>
          <span>In this step you can either download the</span>
          <strong>.csv</strong>
          <span>
            of your Apple Watch or Fitbit data or, use our machine learning
            methods to predict lying, sitting, and walking at difference
            intensities. Select the file you want to predict, select the machine
            learning model for the prediction (we recommend Random Forrest) and
            click the
          </span>
          <strong> Predict File </strong>
          <span>
            button. Once prediction is complete, move to the predicted files
            page.
          </span>
        </div>
        <div className={styles.action_bar}>
          <FormControl component="fieldset">
            <RadioGroup row defaultValue="svm">
              <FormControlLabel
                value="svm"
                control={<Radio color="primary" />}
                label="SVM"
                labelPlacement="end"
              />
              <FormControlLabel
                value="randomForest"
                control={<Radio color="primary" />}
                label="Random Forest"
                labelPlacement="end"
              />
              <FormControlLabel
                value="decissionTree"
                control={<Radio color="primary" />}
                label="Decission Tree"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>

          <Button variant="contained" className={styles.predictBtn}>
            Predict File
          </Button>
          <Button variant="contained" className={styles.downloadBtn}>
            Download File
          </Button>
          <Button
            className={styles.goToPredicted}
            variant="contained"
            href="/predicted-data"
          >
            Go To Predicted Files{" "}
          </Button>
        </div>
        <List className={styles.list} />
      </Container>

      <Snackbar>
        <Alert />
      </Snackbar>
    </div>
  );
};
export default ProcessedDataPage;
