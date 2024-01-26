/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from "react";
import Dropzone from "react-dropzone";
import styles from "../FileUpload.module.css";
import FileDropZoneControls from "./FileDropzoneControls";

function FileDropZone(): ReactElement {
  return (
    <div className={styles.main}>
      <Dropzone>
        {({ getRootProps, getInputProps }) => (
          <section className={styles.dzContainer}>
            <FileDropZoneControls />
            <div {...getRootProps()} className={styles.dropzone}>
              <input {...getInputProps()} />
              <p style={{ fontWeight: "bold", fontSize: "22px" }}>
                Drop files here, or click to select files
              </p>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
}

export default FileDropZone;
