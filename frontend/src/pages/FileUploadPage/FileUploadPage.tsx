import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { Container, Stack, Alert } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import { WatchType } from "shared/api/types";
import useUpload from "shared/hooks/useUpload";
import FileDropZone from "./components/FileDropzone";
import UploadedFiles from "./components/UploadedFiles";
import FileDropZoneControls from "./components/FileDropzoneControls";

function FileUploadPage(): ReactElement {
    const [fileType, setFileType] = useState<WatchType>(WatchType.FITBIT);
    const { handleUpload, isLoading: uploadLoading, error: uploadError } = useUpload();

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
        <Container sx={{ marginTop: 4 }}>
            <Stack spacing={2}>
                <h3>Upload File</h3>
                <FileDropZoneControls onRadioChange={onChange} />
                {uploadError && <Alert severity="error">{uploadError}</Alert>}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <FileDropZone fileType={fileType} handleUpload={handleUpload} />
                    <UploadedFiles refetch={uploadLoading} />
                </Stack>
            </Stack>
        </Container>
    );
}

export default FileUploadPage;
