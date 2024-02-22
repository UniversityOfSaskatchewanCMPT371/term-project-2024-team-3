/* eslint-disable prefer-arrow-callback */

import React from "react";
import Rollbar from "rollbar";
import styles from "./HelpPopup.module.css";

function HelpPopup(): React.ReactElement {
  const rollbarConfig = {
    accessToken: "dbfced96b5df42d295242681f0560764",
    environment: "production",
  };
  const rollbar = new Rollbar(rollbarConfig);
  rollbar.debug("Reached Processed Data page");

  let renders;

  /**
   * gets the list of renders
   */
  function getRenders() {
    const listOfTitles = ["File Upload", "Processed Files", "Predicted Files"];
    const listOfDescriptions = [
      "Step 1: Drag and drop your files into the upload box. Once uploaded your files will appear in the Uploaded Files section on the right. You can select the file you want to process and click the process button. Once you have processed your data it will be saved. You do not need to process it again. Click Go To Processed Files to move to the processed data menu.",
      "Step 2 - Data prediction and download: In this step you can either download the.csvof your Apple Watch or Fitbit data or, use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forrest) and click the Predict File button. Once prediction is complete, move to the predicted files page.",
      "Step 3 - Predicted data files: On this page, you can download your new data files with both the raw Apple Watch or Fitbit data, the features we use for our machine learning models, and the predicted activity for each minute of your data. If you want to upload different files, go back to the file upload page. You can also click on individual steps to rerun a different machine learning model if you want.",
    ];

    let j = -1;
    renders = listOfTitles.map(function (i) {
      j += 1;
      return (
        <div className={styles.textGroup}>
          <div className={styles.dropDownTitle}>
            <text>{i}</text>
            <button className={styles.dropDownButton} type="button">
              V
            </button>
          </div>
          <text className={styles.paragraph}>{listOfDescriptions[j]}</text>
        </div>
      );
    });
  }

  function openPopup() {
    const popup = document.getElementById("popup");

    // assert(popup != null);
    if (popup == null) {
      rollbar.error("Help popup element does not exist in document");
    } else {
      popup.style.display = "block";
    }
  }

  function closePopup() {
    const popup = document.getElementById("popup");

    // assert(popup != null);
    if (popup == null) {
      rollbar.error("Help popup element does not exist in document");
    } else {
      popup.style.display = "none";
    }
  }

  getRenders();

  return (
    <div>
      <button className={styles.helpButton} type="button" onClick={openPopup}>
        ? Help
      </button>
      <div className={styles.popup} id="popup">
        {renders}
        <button
          className={styles.closePopupButton}
          type="button"
          onClick={closePopup}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default HelpPopup;
