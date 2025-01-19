import React, { useState } from "react";
import {
    Button,
    Container,
    Stack,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    FormControlLabel,
    Checkbox,
    ListItemText,
} from "@mui/material";
import useGetUploadedFiles from "shared/hooks/useGetUploadedFiles";
import useProcessFile from "shared/hooks/useProcessFile";
import { RawFileData, WatchType } from "shared/api";
import moment from "moment";
import ErrorSnackbar from "components/ErrorSnackbar/ErrorSnackbar";
import styles from "./UploadedFiles.module.css";

type FilesForProcessing = {
    [key: string]: WatchType;
};

type Props = {
    refetch: boolean;
    onProgressChange: (percentage: number, message: string, isVisible: boolean) => void;
};

function UploadedFiles({ refetch, onProgressChange }: Props) {
    const { handleProcess, isLoading: proccessLoading, error: processingError } = useProcessFile();
    const { uploadedFiles: fitbitFiles, error: fitbitFilesError } = useGetUploadedFiles(
        WatchType.FITBIT,
        refetch || proccessLoading,
    );
    const { uploadedFiles: appleWatchFiles, error: appleWatchFilesError } = useGetUploadedFiles(
        WatchType.APPLE_WATCH,
        refetch || proccessLoading,
    );

    const [checkedItems, setCheckedItems] = useState<FilesForProcessing>({});

    const appleWatchProcessedFiles =
        appleWatchFiles?.length !== 0
            ? appleWatchFiles.map((file: RawFileData) => ({
                  ...file,
                  watch: WatchType.APPLE_WATCH,
              }))
            : [];

    const fitbitProcessedFiles =
        fitbitFiles?.length !== 0
            ? fitbitFiles.map((file: RawFileData) => ({
                  ...file,
                  watch: WatchType.FITBIT,
              }))
            : [];
    const files = fitbitProcessedFiles
        .concat(appleWatchProcessedFiles)
        .sort((a: RawFileData, b: RawFileData) => {
            if (!a.dateTime && !b.dateTime) {
                return 0; // Keep the order unchanged if both items lack dateTime
            }
            if (!a.dateTime) {
                return -1; // Place items without dateTime on top
            }
            if (!b.dateTime) {
                return 1; // Place items without dateTime on top
            }

            return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        });

    const handleToggle = (id: string, watch: WatchType) => {
        setCheckedItems((prev) => {
            const newState = { ...prev };
            if (newState[id]) {
                delete newState[id];
            } else {
                newState[id] = watch;
            }
            return newState;
        });
    };

    const filesProcessLength = Object.keys(checkedItems).length;

    const onProcess = async () => {
        const items = { ...checkedItems };
        const totalTasks = Object.keys(items).length;
        onProgressChange(0, `Preparing ${totalTasks} files for processing`, true);
        let tasksDone = 0;
        // eslint-disable-next-line
        for (const id of Object.keys(items)) {
            let progressPercentage = Math.round((tasksDone / totalTasks) * 100);
            onProgressChange(
                progressPercentage,
                `Processing ${items[id]} File ${id}. This may take a few minutes...`,
                true,
            );
            // eslint-disable-next-line
            await handleProcess(id, items[id]);
            setCheckedItems((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            tasksDone += 1; // Increment tasksDone when handling each upload task
            progressPercentage = Math.round((tasksDone / totalTasks) * 100);
            onProgressChange(
                progressPercentage,
                progressPercentage >= 100 ? `Done!` : `Preparing next file for processing`,
                true,
            );
        }
    };

    return (
        <Container className={styles.box}>
            <ErrorSnackbar error={processingError} />
            <ErrorSnackbar error={fitbitFilesError} />
            <ErrorSnackbar error={appleWatchFilesError} />
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                style={{ height: "100%", paddingBottom: "20px" }}
            >
                <Grid item>
                    <Stack>
                        <h3>Uploaded Files</h3>
                        <List>
                            {files.map((file) => {
                                if (file.processedDataID !== -1) {
                                    return null;
                                }

                                return (
                                    <ListItem
                                        style={{
                                            paddingTop: "0px",
                                            paddingBottom: "0px",
                                            cursor: "pointer",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ListItemIcon>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!checkedItems[file.id.toString()]}
                                                        onChange={() =>
                                                            handleToggle(
                                                                file.id.toString(),
                                                                file.watch,
                                                            )
                                                        }
                                                        color="primary"
                                                        data-testid={`${file.id.toString()}-cbox`}
                                                    />
                                                }
                                                label={`${file.watch === WatchType.APPLE_WATCH ? "AppleWatch" : "Fitbit"} - ${file.id}`}
                                                labelPlacement="end"
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                file.dateTime
                                                    ? moment(file.dateTime).format(
                                                          "ddd, D MMM YYYY, hh:mm:ss A",
                                                      )
                                                    : ""
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Stack>
                </Grid>
                <Grid item className={styles.buttonControl}>
                    <Button
                        className={styles.proccessBtn}
                        variant="contained"
                        disabled={filesProcessLength <= 0 || proccessLoading}
                        onClick={onProcess}
                        data-testid="processBtn"
                    >
                        {filesProcessLength <= 1
                            ? "Process"
                            : `Process ${filesProcessLength} files`}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default UploadedFiles;
