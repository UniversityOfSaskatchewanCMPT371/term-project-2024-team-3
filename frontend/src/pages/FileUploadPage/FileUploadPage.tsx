import React, { ReactElement } from "react";
import Rollbar from "rollbar";
import { Container } from "@mui/material";
import FileDropZone from "./components/FileDropzone";
import styles from "./FileUpload.module.css";

function FileUploadPage(): ReactElement {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached File-upload page");

  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <FileDropZone />
      </Container>
    </div>
  );
}

export default FileUploadPage;
