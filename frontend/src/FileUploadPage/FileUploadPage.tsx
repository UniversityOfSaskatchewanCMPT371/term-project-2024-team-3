import React, { ReactElement } from "react";
import {
  Container
} from "@mui/material";
import FileDropZone from "./components/FileDropzone";
import styles from "./FileUpload.module.css";

const FileUploadPage: React.FC = (): ReactElement => (
  <div className={styles.page}>
    <Container className={styles.container}>
      <div className={styles.bannerinfo}>
        <span>
          <strong>Step 1: </strong>
          Drag and drop your files into the upload box. Once uploaded your files
          will appear in the <strong>Uploaded Files</strong> section on the
          right. You can select the file you want to process and click the
          process button. Once you have processed your data it will be saved.
          You don’t need to process it again. Click{" "}
          <strong>Go To Processed Files</strong> to move to the processed data
          menu.
        </span>
      </div>
      <div className={styles.main}>
        <FileDropZone />
      </div>
    </Container>
  </div>
);

export default FileUploadPage;
