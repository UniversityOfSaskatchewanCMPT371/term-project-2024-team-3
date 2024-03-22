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
import styles from "./UploadedFiles.module.css";

type FilesForProcessing = {
    [key: string]: WatchType;
};

type Props = {
    refetch: boolean;
};

function UploadedFiles({ refetch }: Props) {
    const { handleProcess, isLoading: proccessLoading } = useProcessFile();
    const { uploadedFiles: fitbitFiles } = useGetUploadedFiles(
        WatchType.FITBIT,
        refetch || proccessLoading,
    );
    const { uploadedFiles: appleWatchFiles } = useGetUploadedFiles(
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

    console.log(checkedItems);

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

    const onProcess = () => {
        const items = { ...checkedItems };
        Object.keys(checkedItems).forEach(async (id) => {
            handleProcess(id, items[id]).then(() => {
                delete items[id];
            });
        });
        setCheckedItems(items);
    };

    return (
        <Container className={styles.box}>
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
