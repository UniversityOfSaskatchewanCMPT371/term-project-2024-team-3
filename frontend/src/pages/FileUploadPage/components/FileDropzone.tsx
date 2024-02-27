/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement, useCallback, useState } from "react";
import Rollbar from "rollbar";
import { useDropzone, FileWithPath } from "react-dropzone";
import styles from "../FileUpload.module.css";
import FileDropZoneControls from "./FileDropzoneControls";

function FileDropZone(): ReactElement {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const pstyle = { fontWeight: "bold", fontSize: "22px" }; // add to style sheet

  const clearAcceptedFiles = () => {
    setFiles([]);
  };

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    rollbar.debug(acceptedFiles);

    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [...previousFiles, ...acceptedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
      "application/xml": [".xml"],
    },
  });

  const acceptedFileItems = files.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {Math.round(file.size / 1024)} KB
    </li>
  ));

  return (
    <>
      <FileDropZoneControls onRadioChange={clearAcceptedFiles} />
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
            <div>
              <h4>Accepted Files</h4>
              <ul>{acceptedFileItems}</ul>
            </div>
          </section>
        </div>
      </div>
      <div>
        <button type="submit">Upload</button>
      </div>
    </>
  );
}

export default FileDropZone;
