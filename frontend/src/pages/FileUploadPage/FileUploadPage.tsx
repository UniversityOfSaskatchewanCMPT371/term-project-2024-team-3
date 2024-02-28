import React, { ReactElement } from "react";
import { Container } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import FileDropZone from "./components/FileDropzone";
import styles from "./FileUpload.module.css";

function FileUploadPage(): ReactElement {
  const rollbar = useRollbar();
  rollbar.debug("Reached File-upload page");

  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <div className={styles.bannerinfo}>
          <div>
            <strong>Step 1: </strong>
            <span>
              {" "}
              Drag and drop your files into the upload box. Once uploaded your
              files will appear in the{" "}
            </span>
            <strong>Uploaded Files</strong>
            <span>
              {" "}
              section on the right. You can select the file you want to process
              and click the process button. Once you have processed your data it
              will be saved. You do not need to process it again. Click{" "}
            </span>
            <strong>Go To Processed Files</strong>
            <span> to move to the processed data menu.</span>
          </div>
        </div>
        <FileDropZone />
      </Container>
    </div>
  );
}

export default FileUploadPage;
