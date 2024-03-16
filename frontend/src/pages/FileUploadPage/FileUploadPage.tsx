import React, { ReactElement } from "react";
import { Container } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import FileDropZone from "./components/FileDropzone";
import styles from "./FileUpload.module.css";

function FileUploadPage(): ReactElement {
    const rollbar = useRollbar();
    rollbar.info("Reached File-upload page");

    return (
        <div className={styles.page}>
            <Container className={styles.container}>
                <FileDropZone />
            </Container>
        </div>
    );
}

export default FileUploadPage;
