/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../FileUpload.module.css";
import FileDropZoneControls from "./FileDropzoneControls";

function FileDropZone(): ReactElement {
  const pstyle = { fontWeight: "bold", fontSize: "22px" };
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log(acceptedFiles);
    console.log("okay");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={styles.main}>
      <section className={styles.dzContainer}>
        <FileDropZoneControls />
        <div className={styles.dropzone}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p style={pstyle}>Drop the files here...</p>
          ) : (
            <p style={pstyle}>Drop files here, or click to select files</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default FileDropZone;
