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

  const { handleUpload } = useUpload();

  const [filesPerYear, setFilesPerYear] = useState<{
    [years: string]: FileWithPath[];
  }>({});

  const [fileType, setFileType] = useState<Accept>({
    "application/json": [".json"],
  });

  const [currentFileType, setCurrentFileType] = useState<WatchType>(
    WatchType.FITBIT,
  );

  const pstyle = { fontWeight: "bold", fontSize: "22px" }; // add to style sheet

  const changedType = (event: ChangeEvent, value: string) => {
    // assert(value === "fitbit" || value === "apple");
    setFilesPerYear({});

    if (value === "fitbit") {
      setCurrentFileType(WatchType.FITBIT);
      setFileType({ "application/json": [".json"] });
    } else {
      setCurrentFileType(WatchType.APPLE_WATCH);
      setFileType({ "application/xml": [".xml"] });
    }
  };

  // for fitbit files parse the year out of the files name
  const getYear = (fName: string): string | undefined => {
    // check if the year is the last number in the date
    let fullDate = fName.match("[0-9]{2}([-/ .])[0-9]{2}[-/ .][0-9]{4}");
    if (fullDate) {
      const splitDate = fullDate[0].split(fullDate[1]);
      return splitDate[2];
    }

    // check if the year is the first number in the date
    fullDate = fName.match("[0-9]{4}([-/ .])[0-9]{2}[-/ .][0-9]{2}");
    if (fullDate) {
      const splitDate = fullDate[0].split(fullDate[1]);
      return splitDate[0];
    }
    return undefined;
  };

  //accept the files that are dropped into the dropzone
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    rollbar.debug(acceptedFiles);
    if (acceptedFiles?.length) {
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
        if (fy[year]) fy[year].push(file);
        else fy[year] = [file];
        yearSet.add(year);
      });

      setFilesPerYear(fy);
    }
  };

  //zip a years group of files then send them to the api
  const uploadFiles = async (year: string) => {
    const filesToZip = [...filesPerYear[year]];
    const zip = new Zip();
    if (filesToZip.length < 1) {
      return;
    }

    filesToZip.forEach((file) => {
      zip.file(file.name, file);
    });
    zip
      .generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      })
      .then(async (content) => {
        const formData = new FormData();
        formData.set("fname", `${fileType}.zip`);
        formData.set("data", content);
        return handleUpload(formData, year, currentFileType);
      })
      .then(() => {
        const newFilesPerYear = { ...filesPerYear };
        delete newFilesPerYear[year];
        setFilesPerYear(newFilesPerYear);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileType,
  });

  //displays uploaded files grouped by year
  const acceptedFileItems = Object.keys(filesPerYear).map((year: string) => (
    <div
      key={year}
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
