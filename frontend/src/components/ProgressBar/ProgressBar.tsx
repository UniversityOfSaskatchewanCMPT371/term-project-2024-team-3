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
};

/**
 * displays a minimizable progress bar
 * @param props percentage: a number between 0 and 100, a value not in this range will not display the progress bar
 * @returns either a progress bar popup with a screen overlay, or nothing
 * requires percentage prop
 */
function ProgressBar(props: Props): React.ReactElement | null {
    const { isAuthenticated } = useAuth(); // use the useAuth hook to get the current user
    // If the user is not logged in, don't render the help popup
    if (!isAuthenticated) {
        return null;
    }
    const rollbar = useRollbar();
    rollbar.info("ProgressBar");
    // const [percentage, setPercentage] = useState<number>();
    const { percentage, message } = props;

    /**
     * Opens the popup, and hides the maximize button
     */
    const openPopup = () => {
        const popup = document.getElementById("progressBarPopup");
        const overLay = document.getElementById("progressOverlay");
        const maxButton = document.getElementById("maximizeButton");
        console.log(popup);

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
        console.log(popup);

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
    if (percentage >= 0 && percentage <= 100) {
        return (
            <div className={styles.main}>
                <div className={styles.overlay} id="progressOverlay" />

                <div className={styles.popup} id="progressBarPopup">
                    <div className={styles.header}>
                        <Button
                            className={styles.minimizeButton}
                            variant="contained"
                            onClick={closePopup}
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
                >
                    Maximize
                </Button>
            </div>
        );
    }
    return null;
}

export default ProgressBar;
