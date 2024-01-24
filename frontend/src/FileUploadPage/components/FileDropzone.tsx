import React from "react";
import Dropzone from "react-dropzone";
import {
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import styles from "./FileUpload.module.css";

function FileDropZone() {
  return (
    <Dropzone>
      {({ getRootProps, getInputProps }) => (
        <section className={styles.dzContainer}>
          <div className={styles.fd_header}>
            <span>Select File Type: </span>
            <FormControl component="fieldset" className={styles.f_radio}>
              <RadioGroup>
                <FormControlLabel
                  value="fitbit"
                  control={<Radio color="primary" />}
                  label="Fitbit"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="apple"
                  control={<Radio color="primary" />}
                  label="Apple Watch"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
            <div>
              <Button variant="contained" className={styles.delete_btn}>
                Delete All
              </Button>
            </div>
          </div>
          <div {...getRootProps({ style: dropzoneStyle })}>
            <input {...getInputProps()} />
            <p style={{ fontWeight: "bold", fontSize: "22px" }}>
              Drop files here, or click to select files
            </p>
            <span style={{ fontWeight: "bold" }}>Files:</span>
            <div
              className={styles.acceptedFiles}
              {...getRootProps({
                onClick: (event) => event.stopPropagation(),
              })}
            />
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default FileDropZone;
