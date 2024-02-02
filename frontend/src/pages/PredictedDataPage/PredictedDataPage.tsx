import React from "react";
import { Button, Container, List, Snackbar, Alert } from "@mui/material";
import styles from "./PredictedDataPage.module.css";

const PredictedDataPage = function () {
  return (
    <div>
      <Container className={styles.container}>
        <div className={styles.bannerinfo}>
          <strong>Step 3 - Predicted data files: </strong>
          <span>
            On this page, you can download your new data files with both the raw
            Apple Watch or Fitbit data, the features we use for our machine
            learning models, and the predicted activity for each minute of your
            data.
          </span>
        </div>
        <div className={styles.container}>
          <h1>Files: </h1>
          <Button variant="contained" className={styles.downloadBtn}>
            Download File
          </Button>
        </div>
        <List className={styles.list} />
        <div className={styles.bannerinfo}>
          <span>
            If you want to upload different files, go back to the file upload
            page. You can also click on individual steps to rerun a different
            machine learning model if you want.
          </span>
        </div>
      </Container>
      <Snackbar>
        <Alert />
      </Snackbar>
    </div>
  );
};

export default PredictedDataPage;
