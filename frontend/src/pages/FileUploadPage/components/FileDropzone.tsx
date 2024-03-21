/* eslint-disable react/jsx-props-no-spreading */
import React, { ChangeEvent, ReactElement, useState } from "react";
import { useRollbar } from "@rollbar/react";
import { useDropzone, FileWithPath, Accept } from "react-dropzone";
import { WatchType } from "shared/api";
import { Button } from "@mui/material";
import Zip from "jszip";
import useUpload from "shared/hooks/useUpload";
import FileDropZoneControls from "./FileDropzoneControls";
import styles from "../FileUpload.module.css";

function FileDropZone(): ReactElement {
    const rollbar = useRollbar();
    rollbar.debug("Reached dropzone component");

    const { handleUpload, error: useUploadError } = useUpload();

    const [filesPerYear, setFilesPerYear] = useState<{ [years: string]: FileWithPath[] }>({});

    const [fileType, setFileType] = useState<Accept>({
        "application/json": [".json"],
    });

    const [currentFileType, setCurrentFileType] = useState<WatchType>(WatchType.FITBIT);

    const pstyle = { fontWeight: "bold", fontSize: "22px" }; // add to style sheet

    /**
     * Adjust the file type to mach the given type
     */
    const changedType = (event: ChangeEvent, value: string) => {
        console.assert(value === "fitbit" || value === "apple", "unexpected type: ".concat(value));
        setFilesPerYear({});

        if (value === "fitbit") {
            setCurrentFileType(WatchType.FITBIT);
            setFileType({ "application/json": [".json"] });
            rollbar.info("Changed to accept .json files (Fitbit)");
        } else {
            setCurrentFileType(WatchType.APPLE_WATCH);
            setFileType({ "application/xml": [".xml"] });
            rollbar.info("Changed to accept .xml files (Apple)");
        }
    };

    /**
     * For fitbit files parse the year out of the files name
     * Can be used for any file but currently only fitbit files are expected to have a year in their name
     * Precondition: year is full year (2019) not last 2 digits (19)
     * Returns: The year or undefined if no year is found
     */
    const getYear = (fName: string): string | undefined => {
        // check if the year is the last number in the date
        console.debug("Parsing year from: ".concat(fName));

        let fullDate = fName.match("[0-9]{2}([-/ .])[0-9]{2}[-/ .][0-9]{4}");
        if (fullDate) {
            const splitDate = fullDate[0].split(fullDate[1]);
            rollbar.debug("Year is the last number: ".concat(splitDate[2]));
            return splitDate[2];
        }

        // check if the year is the first number in the date
        fullDate = fName.match("[0-9]{4}([-/ .])[0-9]{2}[-/ .][0-9]{2}");
        if (fullDate) {
            const splitDate = fullDate[0].split(fullDate[1]);
            rollbar.debug("Year is the first number: ".concat(splitDate[0]));
            return splitDate[0];
        }
        rollbar.debug("Unable to find year match");
        return undefined;
    };

    /**
     * Accept the files that are dropped into the dropzone
     * Precondition: A file is dropped into the dropzone(or selected from file explorer prompt)
     *      current file type has to have a value
     *      Apple watches do not have a year
     * Postconditon: dropped files are added to filesPerYear,
     *      key dependant on years that can be parsed from the files names
     */
    const onDrop = (acceptedFiles: FileWithPath[]) => {
        rollbar.info("User has dropped files into dropzone");
        if (acceptedFiles?.length) {
            rollbar.debug(acceptedFiles);
            const fy = { ...filesPerYear };
            const yearSet = new Set();
            Object.keys(fy).forEach((year) => yearSet.add(year));
            acceptedFiles.forEach((file) => {
                // apple files do not contain a year
                if (currentFileType === WatchType.APPLE_WATCH) {
                    if (fy["Apple Export"]) fy["Apple Export"].push(file);
                    else fy["Apple Export"] = [file];
                    yearSet.add("Apple Export");
                    return;
                }

                const parsedYear = getYear(file.name);
                const year = parsedYear || "Yearless Fitbit Export";
                if (fy[year]) {
                    rollbar.debug("Added ".concat(file.name).concat(" to year: ").concat(year));
                    fy[year].push(file);
                } else {
                    rollbar.debug(
                        "New Year found: ".concat(year).concat(" for file: ").concat(file.name),
                    );
                    fy[year] = [file];
                }
                yearSet.add(year);
            });
            setFilesPerYear(fy);
        }
    };

    /**
     * Zip a years group of files then send them to the api
     * Precondition: There is a key that matches they year passed in filesPerYear
     * Postconditon: Given years files are zipped and sent to the api and are removed from filesPerYear
     */
    const uploadFiles = async (year: string) => {
        console.assert(Object.keys(filesPerYear).includes(year), "Year doesn't have any files"); // call assert() instead of console.assert() and can handle AssertionError with rollbar call and graceful exit instead
        // this work should be done in a different ticket
        const filesToZip = [...filesPerYear[year]];
        const zip = new Zip();
        if (filesToZip.length < 1) {
            return;
        }

        filesToZip.forEach((file) => {
            zip.file(file.name, file);
        });
        zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        })
            .then(async (content) => {
                const formData = new FormData();
                formData.set("fname", `${fileType}.zip`);
                formData.set("data", content);
                rollbar.info("sending upload");
                return handleUpload(formData, year, currentFileType);
            })
            .then(() => {
                if (useUploadError) {
                    rollbar.error(useUploadError);
                    return;
                }
                const newFilesPerYear = { ...filesPerYear };
                delete newFilesPerYear[year];
                rollbar.debug("removed uploaded files from accepted files");
                setFilesPerYear(newFilesPerYear);
            });
    };

    /**
     * constructs react dropzone
     */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: fileType,
    });

    /**
     * Displays uploaded files grouped by year
     * Precondition: filesPerYear not null
     */

    const acceptedFileItems = Object.keys(filesPerYear).map((year: string) => (
        <div
            key={year}
            data-testid={year}
            style={{
                width: "100%",
                padding: "10px",
                border: "1px solid black",
                borderRadius: "5px",
                boxSizing: "border-box",
                marginBottom: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <strong>{year}</strong>
            <small>{filesPerYear[year].length} files</small>
            <Button
                data-testid={`${year}-btn`}
                style={{ color: "#FFFFFF", backgroundColor: "#36BDC4" }}
                variant="contained"
                onClick={() => uploadFiles(year)}
            >
                Upload
            </Button>
        </div>
    ));

    return (
        <>
            <FileDropZoneControls onRadioChange={changedType} />
            <div {...getRootProps()} data-testid="dropZone">
                <div className={styles.main}>
                    <section className={styles.dzContainer}>
                        <div className={styles.dropzone}>
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p style={pstyle}>Drop the files here...</p>
                            ) : (
                                <p style={pstyle}>Drop files here, or Click</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            <div>
                <h4>Accepted Files</h4>
                <ul>{acceptedFileItems}</ul>
            </div>
        </>
    );
}

export default FileDropZone;
