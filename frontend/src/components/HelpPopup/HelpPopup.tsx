import React from "react";
import { useRollbar } from "@rollbar/react";
// import assert from "shared/util/assert";
import { equal } from "assert";
import { useAuth } from "../Authentication/useAuth";
import styles from "./HelpPopup.module.css";

function HelpPopup(): React.ReactElement | null {
    const { isAuthenticated } = useAuth(); // use the useAuth hook to get the current user
    // If the user is not logged in, don't render the help popup
    if (!isAuthenticated) {
        return null;
    }
    const rollbar = useRollbar();

    let renders;
    /**
     * toggles the display of the paragraph for each sub-section
     * modifies display of paragraph, and innerHTML of the button
     * @param e an event from the button click
     */
    function toggleTextDisplay(e: React.FormEvent<EventTarget>) {
        const target = e.target as HTMLInputElement;
        if (target == null) {
            rollbar.error("Button Error on pop up");
        } else {
            const paragraph = document.getElementById(`Paragraph ${target.value}`);
            const button = document.getElementById(`button ${target.value}`);
            if (paragraph == null) {
                rollbar.error("Paragraph not found in help popup");
            } else if (button == null) {
                rollbar.error("Expansion button not found in help popup");
            } else {
                console.log("EXPAND");

                if (paragraph.getAttribute("values") === "closed") {
                    paragraph.style.display = "block";
                    button.innerHTML = "^";
                    paragraph.setAttribute("values", "opened");

                    expect(equal(button.innerHTML, "^"));
                    expect(equal(paragraph.getAttribute("values"), "opened"));
                } else if (paragraph.getAttribute("values") === "opened") {
                    paragraph.style.display = "none";
                    button.innerHTML = "v";
                    paragraph.setAttribute("values", "closed");

                    expect(equal(button.innerHTML, "v"));
                    expect(equal(paragraph.getAttribute("values"), "closed"));
                    // assert(button.innerHTML === "v", null, rollbar);
                    // assert(paragraph.getAttribute("values") === "closed", null, rollbar);
                }
            }
        }
    }

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
        renders = listOfTitles.map((i) => {
            j += 1;

            return (
                <div className={styles.textGroup}>
                    <div className={styles.dropDownTitle}>
                        <text>{i}</text>
                        <button
                            className={styles.dropDownButton}
                            type="button"
                            onClick={toggleTextDisplay}
                            value={j}
                            id={`button ${j}`}
                            data-testid={`button ${j}`}
                        >
                            v
                        </button>
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
            );
        });
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

    getRenders();

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
                {renders}
                <button
                    className={styles.closePopupButton}
                    type="button"
                    onClick={closePopup}
                    data-testid="closePopupButton"
                >
                    &#x2197;
                </button>
            </div>
        </div>
    );
}

export default HelpPopup;
