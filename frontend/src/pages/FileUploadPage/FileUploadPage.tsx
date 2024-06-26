import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { Container, Stack, Alert } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import { WatchType } from "shared/api/types";
import useUpload from "shared/hooks/useUpload";
import { ProgressBar, ProgressBarType } from "components/ProgressBar/ProgressBar";
import assert from "shared/util/assert";
import FileDropZone from "./components/FileDropzone";
import UploadedFiles from "./components/UploadedFiles";
import FileDropZoneControls from "./components/FileDropzoneControls";

function FileUploadPage(): ReactElement {
    const [fileType, setFileType] = useState<WatchType>(WatchType.FITBIT);
    const [progressBar, setProgressbar] = useState<ProgressBarType>({
        percentage: 0,
        message: "N/A",
        isVisible: false,
    });
    const { handleUpload, isLoading: uploadLoading, error: uploadError } = useUpload();

    const rollbar = useRollbar();

    const onProgressChange = (percentage: number, message: string, isVisible: boolean) => {
        if (percentage >= 100) {
            setProgressbar({
                percentage,
                message,
                isVisible: true,
            });
            setTimeout(() => {
                setProgressbar({
                    percentage,
                    message,
                    isVisible: false,
                });
            }, 2000);
        } else {
            setProgressbar({
                percentage,
                message,
                isVisible,
            });
        }
    };

    useEffect(() => {
        rollbar.info("Reached File-upload page");

        if (uploadError && progressBar.isVisible) {
            onProgressChange(100, `An Error Occured! ${uploadError}`, true);
        }
    }, [uploadError, progressBar]);

    const onChange = (event: ChangeEvent, value: string) => {
        assert(value === "fitbit" || value === "apple", "unexpected type: ".concat(value), rollbar);

        if (value === "fitbit") {
            setFileType(WatchType.FITBIT);
            rollbar.info("Changed to accept .json files (Fitbit)");
        } else {
            setFileType(WatchType.APPLE_WATCH);
            rollbar.info("Changed to accept .xml files (Apple)");
        }
    };

    return (
        <>
            <ProgressBar
                message={progressBar.message}
                isVisible={progressBar.isVisible}
                percentage={progressBar.percentage}
            />
            <Container sx={{ marginTop: 6 }}>
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
                        <FileDropZone
                            fileType={fileType}
                            handleUpload={handleUpload}
                            onProgressChange={onProgressChange}
                        />
                        <UploadedFiles
                            refetch={uploadLoading}
                            onProgressChange={onProgressChange}
                        />
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}

export default FileUploadPage;
