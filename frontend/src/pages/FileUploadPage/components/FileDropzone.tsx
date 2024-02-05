/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement, useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import styles from "../FileUpload.module.css";
import FileDropZoneControls from "./FileDropzoneControls";

function FileDropZone(): ReactElement {
  const [files, setFiles] = useState<FileWithPath[]>([]); // eslint-disable-line

  const pstyle = { fontWeight: "bold", fontSize: "22px" }; // add to style sheet

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    console.log(acceptedFiles);

    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [...previousFiles, ...acceptedFiles]);
    }
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: {
        "application/json": [".json"],
        "application/xml": ["xml"],
      },
    });

  const acceptedFileItems = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
      <FileDropZoneControls />
      <div {...getRootProps()}>
        <div className={styles.main}>
          <section className={styles.dzContainer}>
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
      </div>
      <aside>
        <h4>Accepted Files</h4>
        <ul>{acceptedFileItems}</ul>
      </aside>
    </>
  );
}

export default FileDropZone;
