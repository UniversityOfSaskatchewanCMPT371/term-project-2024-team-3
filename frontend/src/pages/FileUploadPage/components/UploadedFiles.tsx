import React from "react";
import {
    Button,
    Container,
    Stack,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    FormControlLabel,
    RadioGroup,
    ListItemText,
    Radio,
} from "@mui/material";
import useGetUploadedFiles from "shared/hooks/useGetUploadedFiles";
import { RawFileData, WatchType } from "shared/api";
import moment from "moment";
import styles from "./UploadedFiles.module.css";

type Props = {
    refetch: boolean;
};

function UploadedFiles({ refetch }: Props) {
    console.log(refetch);
    const { uploadedFiles: fitbitFiles } = useGetUploadedFiles(WatchType.FITBIT, refetch);
    const { uploadedFiles: appleWatchFiles } = useGetUploadedFiles(WatchType.APPLE_WATCH, refetch);

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

    const files = fitbitProcessedFiles.concat(appleWatchProcessedFiles).sort((a: RawFileData, b: RawFileData) => {
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
                                if (file.processedDataID === -1) {
                                    return (
                                        <ListItem
                                            style={{
                                                paddingTop: "0px",
                                                paddingBottom: "0px",
                                                cursor: "pointer",
                                                justifyContent:"space-between"
                                            }}
                                        >
                                            <ListItemIcon>
                                                <RadioGroup>
                                                    <FormControlLabel
                                                        value=""
                                                        label={`${file.watch === WatchType.APPLE_WATCH ? "AppleWatch" : "Fitbit"} - ${file.id}`}
                                                        control={<Radio color="primary" />}
                                                        labelPlacement="end"
                                                    />
                                                </RadioGroup>
                                            </ListItemIcon>
                                            <ListItemText />
                                            {file.dateTime ? (
                                                <ListItemText
                                                    primary={moment(file.dateTime).format(
                                                        "ddd, D MMM YYYY, hh:mm:ss A",
                                                    )}
                                                />
                                            ) : (
                                                ""
                                            )}
                                            <ListItemIcon style={{ cursor: "pointer" }} />
                                        </ListItem>
                                    );
                                }

                                return null;
                            })}
                        </List>
                    </Stack>
                </Grid>
                <Grid item className={styles.buttonControl}>
                    <Button className={styles.proccessBtn} variant="contained">
                        Process
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default UploadedFiles;
