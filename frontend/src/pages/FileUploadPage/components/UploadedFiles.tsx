import React, { useState, useEffect } from "react";
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
    const [removedFiles, setRemovedFiles] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        // Retrieve deleted files from localStorage
        const storedRemovedFiles = localStorage.getItem("removedFiles");
        if (storedRemovedFiles) {
            setRemovedFiles(new Set(JSON.parse(storedRemovedFiles)));
        }
    }, []);

    
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
        .filter((file) => !removedFiles.has(file.id.toString()))
        .sort((a: RawFileData, b: RawFileData) => {
            if (!a.dateTime && !b.dateTime) {
                return 0;
            }
            if (!a.dateTime) {
                return -1;
            }
            if (!b.dateTime) {
                return 1;
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

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        const items = { ...checkedItems };

        // Update the removed files state
        setRemovedFiles((prev) => {
            const newSet = new Set(prev);

            // Add the checked file IDs to the removed files set
            Object.keys(items).forEach((id) => newSet.add(id));

            // Save the updated set to localStorage
            localStorage.setItem("removedFiles", JSON.stringify(Array.from(newSet)));

            return newSet;
        });

        // Clear the checked items and close the dialog
        setCheckedItems({});
        setDeleteDialogOpen(false);
    };



    const cancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const filesProcessLength = Object.keys(checkedItems).length;

    const onProcess = async () => {
        const items = { ...checkedItems };
        const totalTasks = Object.keys(items).length;
        onProgressChange(0, `Preparing ${totalTasks} files for processing`, true);

        const taskPromises = Object.keys(items).map(async (id, index) => {
            const progressPercentage = Math.round((index / totalTasks) * 100);
            onProgressChange(
                progressPercentage,
                `Processing ${items[id]} File ${id}. This may take a few minutes...`,
                true,
            );

            await handleProcess(id, items[id]);

            setCheckedItems((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });

            const updatedProgress = Math.round(((index + 1) / totalTasks) * 100);
            onProgressChange(
                updatedProgress,
                updatedProgress >= 100 ? `Done!` : `Preparing next file for processing`,
                true,
            );
        });

        await Promise.all(taskPromises);
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
                                        key={file.id.toString()}
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
                    <Button
                        className={`${styles.deleteBtn}`}
                        variant="contained"
                        disabled={filesProcessLength <= 0}
                        onClick={handleDelete}
                        data-testid="deleteBtn"
                    >
                        {filesProcessLength <= 1 ? "Delete" : `Delete ${filesProcessLength} files`}
                    </Button>
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete the selected files?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        className={`${styles.cancelBtn}`}
                        onClick={cancelDelete}
                        data-testid="cancelBtn"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        className={`${styles.confirmBtn}`}
                        autoFocus
                        data-testid="confirmBtn"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default UploadedFiles;
