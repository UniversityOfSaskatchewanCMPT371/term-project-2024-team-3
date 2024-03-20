import React from "react";
import { useRollbar } from "@rollbar/react";
import { Button, LinearProgress } from "@mui/material";
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

    function openPopup() {
        const popup = document.getElementById("popup");

        // console.assert(popup != null);
        if (popup == null) {
            rollbar.error("Help popup element does not exist in document");
        } else {
            popup.style.display = "block";
        }
    }

    // function closePopup() {
    //     const popup = document.getElementById("popup");

    //     if (popup == null) {
    //         rollbar.error("Help popup element does not exist in document");
    //     } else {
    //         popup.style.display = "none";
    //     }
    // }

    return (
        <div>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <Button
                        className={styles.minimizeButton}
                        variant="contained"
                        // onClick={closePopup}
                    >
                        _
                    </Button>
                </div>

                <div className="body">
                    {/* <div className={styles.outterProgress}>
                        <div className={styles.innerProgress} />
                    </div>
                    
                    <div>{percentage}</div> */}
                    <LinearProgress variant="determinate" value={percentage} />
                </div>
            </div>
            <button className="maximizeButton" type="button" onClick={openPopup}>
                +
            </button>
        </div>
    );
}

export default ProgressBar;
