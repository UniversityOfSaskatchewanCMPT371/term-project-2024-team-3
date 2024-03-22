import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import { WatchType } from "shared/api/types";
import FileDropZone from "./components/FileDropzone";
import styles from "./FileUpload.module.css";
import UploadedFiles from "./components/UploadedFiles";
import FileDropZoneControls from "./components/FileDropzoneControls";

function FileUploadPage(): ReactElement {
    const [fileType, setFileType] = useState<WatchType>(WatchType.FITBIT);

    const rollbar = useRollbar();

    useEffect(() => {
        rollbar.info("Reached File-upload page");
    }, []);

    const onChange = (event: ChangeEvent, value: string) => {
        console.assert(value === "fitbit" || value === "apple", "unexpected type: ".concat(value));

        if (value === "fitbit") {
            setFileType(WatchType.FITBIT);
            rollbar.info("Changed to accept .json files (Fitbit)");
        } else {
            setFileType(WatchType.APPLE_WATCH);
            rollbar.info("Changed to accept .xml files (Apple)");
        }
    };

    return (
        <div className={styles.page}>
            <Container className={styles.container}>
                <FileDropZoneControls onRadioChange={onChange} />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    spacing={2}
                >
                    <FileDropZone fileType={fileType} />
                    <UploadedFiles />
                </Stack>
            </Container>
        </div>
    );
}

export default FileUploadPage;
