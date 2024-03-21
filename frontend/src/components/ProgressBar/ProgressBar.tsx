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
};

/**
 * displays a minimizable progress bar
 * @param props percentage: a number between 0 and 100
 * @returns a progress bar
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
    const { percentage } = props;

    const openPopup = () => {
        const popup = document.getElementById("progressBarPopup");
        const overLay = document.getElementById("progressOverlay");
        console.log(popup);

        if (popup == null || overLay == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.hidden = false;
            overLay.hidden = false;
        }
    };

    const closePopup = () => {
        const popup = document.getElementById("progressBarPopup");
        const overLay = document.getElementById("progressOverlay");
        console.log(popup);

        if (popup == null || overLay == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.hidden = true;
            overLay.hidden = true;
        }
    };

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
                    Your task is being processed. Please wait...
                    <div className={styles.outterProgress}>
                        <div
                            className={styles.innerProgress}
                            style={{
                                width: `${percentage}%`,
                            }}
                        >
                            <div className={styles.percentageText}>{`${percentage}%`}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Button className={styles.maximizeButton} variant="contained" onClick={openPopup}>
                +
            </Button>
        </div>
    );
}

export default ProgressBar;
