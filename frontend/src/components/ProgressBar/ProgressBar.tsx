import React from "react";
import { useRollbar } from "@rollbar/react";
import {
    Button,
    // LinearProgress
} from "@mui/material";
import { useAuth } from "../Authentication/useAuth";
import styles from "./ProgressBar.module.css";

type Props = {
    percentage: number;
    message: string;
    isVisible: boolean;
};

/**
 * displays a minimizable progress bar
 * @param props
 *      percentage: a number between 0 and 100, a value not in this range will not display the progress bar
 *      message: A string message to display to the user while their request is being fulfilled
 *      isVisible: A boolean to determine whether the progress bar is displayed or not.
 * @returns either a progress bar popup with a screen overlay, or nothing
 * requires percentage, message, isVisible
 */
function ProgressBar(props: Props): React.ReactElement | null {
    const { isAuthenticated } = useAuth(); // use the useAuth hook to get the current user
    // If the user is not logged in, don't render the progressBar
    if (!isAuthenticated) {
        return null;
    }
    const rollbar = useRollbar();
    rollbar.info("ProgressBar");

    const { percentage, message, isVisible } = props;

    /**
     * Opens the popup, and hides the maximize button
     */
    const openPopup = () => {
        const popup = document.getElementById("progressBarPopup");
        const overLay = document.getElementById("progressOverlay");
        const maxButton = document.getElementById("maximizeButton");

        if (popup == null || overLay == null || maxButton == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.hidden = false;
            overLay.hidden = false;
            maxButton.style.display = "none";
        }
    };

    /**
     * hides the popup, and displays the maximize button
     */
    const closePopup = () => {
        const popup = document.getElementById("progressBarPopup");
        const overLay = document.getElementById("progressOverlay");
        const maxButton = document.getElementById("maximizeButton");

        if (popup == null || overLay == null || maxButton == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.hidden = true;
            overLay.hidden = true;
            maxButton.style.display = "block";
        }
    };

    /**
     * Ensures the progress bar displays the correct minimum width
     * @returns 9 if the percentage is less than 9, percent otherwise
     */
    const getMinWidth = () => {
        if (percentage < 9) {
            return 9;
        }
        return percentage;
    };

    /**
     * only display if the percent is between 0 and 100 inclusively
     */
    if (percentage >= 0 && percentage <= 100 && isVisible) {
        return (
            <div className={styles.main}>
                <div className={styles.overlay} id="progressOverlay" />

                <div className={styles.popup} id="progressBarPopup" data-testid="progressBarPopup">
                    <div className={styles.header}>
                        <Button
                            className={styles.minimizeButton}
                            variant="contained"
                            onClick={closePopup}
                            data-testid="minimizeButton"
                        >
                            Minimize
                        </Button>
                    </div>

                    <div className={styles.body}>
                        <div className={styles.messageDiv}>{message}</div>
                        <div className={styles.outterProgress}>
                            <div
                                className={styles.innerProgress}
                                style={{
                                    width: `${getMinWidth()}%`,
                                }}
                                data-testid="progressBarInner"
                            >
                                <div className={styles.percentageText}>{`${percentage}%`}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    className={styles.maximizeButton}
                    id="maximizeButton"
                    variant="contained"
                    onClick={openPopup}
                    data-testid="maximizeButton"
                >
                    Maximize
                </Button>
            </div>
        );
    }
    return null;
}

export default ProgressBar;
