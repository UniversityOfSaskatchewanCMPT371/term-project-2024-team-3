import React from "react";
import { Button, Container, List } from "@mui/material";
import styles from "./PredictedDataPage.module.css";

function PredictedFiles(): React.ReactElement {
  return (
    <div>
      <h1>This is the Predicted Files page</h1>
      <div>
        <Container>
          <div className={styles.bannerinfo}>
            <span>
              <strong>Step 3 - Predicted data files: </strong>
              On this page, you can download your new data files with both the
              raw Apple Watch or Fitbit data, the features we use for our
              machine learning models, and the predicted activity for each
              minute of your data.
            </span>
          </div>
          <div className={styles.container}>
            <h3>Files: </h3>
            <Button variant="contained" className={styles.downloadBtn}>
              Download File
            </Button>
          </div>
          <List className={styles.list}>
            <div className={styles.bannerinfo}>
              <span>
                If you want to upload different files, go back to the file
                upload page. You can also click on individual steps to rerun a
                different machine learning model if you want.
              </span>
            </div>
          </List>
        </Container>
      </div>
    </div>
  );
}

export default PredictedFiles;
