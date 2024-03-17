import React, { ReactElement } from "react";
import { Container } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import FileDropZone from "./components/FileDropzone";
import styles from "./FileUpload.module.css";
import UploadedFiles from "./components/UploadedFiles";

function FileUploadPage(): ReactElement {
    const rollbar = useRollbar();
    rollbar.debug("Reached File-upload page");

    return (
        <div className={styles.page}>
            <Container className={styles.container}>
                <FileDropZone />
            </Container>
            <UploadedFiles />
        </div>
    );
}

export default FileUploadPage;
