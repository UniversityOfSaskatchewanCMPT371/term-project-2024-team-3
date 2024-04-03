import React from "react";
import { useRollbar } from "@rollbar/react";
import assert from "shared/util/assert";
import { useAuth } from "../Authentication/useAuth";
import styles from "./HelpPopup.module.css";

function HelpPopup(): React.ReactElement | null {
    const { isAuthenticated } = useAuth(); // use the useAuth hook to get the current user
    // If the user is not logged in, don't render the help popup
    if (!isAuthenticated) {
        return null;
    }
    const rollbar = useRollbar();

    /**
     * toggles the display of the paragraph for each sub-section
     * modifies display of paragraph, and innerHTML of the button
     * @param j index of the button click
     */
    function toggleTextDisplay(j: number) {
        return () => {
            const paragraph = document.getElementById(`Paragraph ${j}`);
            const button = document.getElementById(`button ${j}`);
            if (paragraph == null) {
                rollbar.error("Paragraph not found in help popup");
            } else if (button == null) {
                rollbar.error("Expansion button not found in help popup");
            } else {
                console.log("EXPAND");

                if (paragraph.getAttribute("values") === "closed") {
                    paragraph.style.display = "block";
                    paragraph.setAttribute("values", "opened");
                    // Change the background color of the div or text when the paragraph is opened
                    const element = document.getElementById(`button ${j}`);
                    if (element !== null) {
                        element.style.backgroundColor = "lightgray";
                    }

                    assert(paragraph.getAttribute("values") === "opened", null, rollbar);
                } else if (paragraph.getAttribute("values") === "opened") {
                    paragraph.style.display = "none";
                    paragraph.setAttribute("values", "closed");
                    // Change the background color of the div or text back when the paragraph is closed
                    const element = document.getElementById(`button ${j}`);
                    if (element !== null) {
                        element.style.backgroundColor = "#5fced3";
                    }

                    assert(paragraph.getAttribute("values") === "closed", null, rollbar);
                }
            }
        };
    }

    function openPopup() {
        const popup = document.getElementById("popup");

        if (popup == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.style.display = "block";
        }
    }

    function closePopup() {
        const popup = document.getElementById("popup");

        if (popup == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.style.display = "none";
        }
    }

    const listOfTitles = ["File Upload", "Processed Files", "Predicted Files"];
    const listOfDescriptions = [
        "Step 1: Drag and drop your files into the upload box. Once uploaded, your files will appear in the Uploaded Files section on the right. You can select the file you want to process and click the process button. Once you have processed your data it will be saved. You do not need to process it again. Click Go To Processed Files to move to the processed data menu.",
        "Step 2 - Data prediction and download: In this step you can either download the .csv of your Apple Watch or Fitbit data, or use our machine learning methods to predict lying, sitting, and walking at difference intensities. Select the file you want to predict, select the machine learning model for the prediction (we recommend Random Forest) and click the Predict File button. Once prediction is complete, move to the predicted files page.",
        "Step 3 - Predicted data files: On this page you can download your new data files with both the raw Apple Watch or Fitbit data, the features we use for our machine learning models, and the predicted activity for each minute of your data. If you want to upload different files, go back to the file upload page. You can also click on individual steps to rerun a different machine learning model as you desire.",
    ];

    return (
        <div>
            <button
                className={styles.helpButton}
                type="button"
                onClick={openPopup}
                id="popupButton"
                data-testid="popupButton"
            >
                ? Help
            </button>
            <div className={styles.popup} id="popup" data-testid="popup">
                {listOfTitles.map((i, j) => (
                    <div
                        className={styles.textGroup}
                        onClick={toggleTextDisplay(j)}
                        onKeyDown={toggleTextDisplay(j)}
                        id={`button ${j}`}
                        data-testid={`button ${j}`}
                        role="button"
                        tabIndex={0}
                    >
                        <div className={styles.dropDownTitle}>
                            <text>{i}</text>
                        </div>
                        <text
                            className={styles.paragraph}
                            id={`Paragraph ${j}`}
                            values="closed"
                            data-testid={`Paragraph ${j}`}
                        >
                            {listOfDescriptions[j]}
                        </text>
                    </div>
                ))}
                <button
                    className={styles.closePopupButton}
                    type="button"
                    onClick={closePopup}
                    data-testid="closePopupButton"
                >
                    ↗
                </button>
            </div>
        </div>
    );
}

export default HelpPopup;
