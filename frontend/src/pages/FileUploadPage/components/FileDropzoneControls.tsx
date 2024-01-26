import React, { ReactElement } from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import styles from "../FileUpload.module.css";

function FileDropZoneControls(): ReactElement {
  return (
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
    </div>
  );
}

export default FileDropZoneControls;
