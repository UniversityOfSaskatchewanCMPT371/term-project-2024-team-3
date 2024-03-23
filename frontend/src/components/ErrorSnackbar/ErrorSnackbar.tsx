import React, { useState, useEffect } from "react";
import { useRollbar } from "@rollbar/react";
import { Alert, Snackbar } from "@mui/material";

type Props = {
    error: string | null;
};

// Designed to automatically handle and show snackbar errors to users
// This can be called in any part of rendering in the dom as it gets rendered outside
// Make sure the error passed are handled in a state, e.g our api hooks
function ErrorSnackbar({ error }: Props): React.ReactElement<typeof Snackbar> | null {
    const rollbar = useRollbar();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (error) {
            setOpen(true);
            rollbar.error(error);
        }
    }, [error, rollbar]);

    const handleClose = (event: React.SyntheticEvent<Element, Event> | Event, reason: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleSnackbarClose = () => {
        setOpen(false);
    };

    if (!error) {
        return null;
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
        >
            <Alert
                severity="error"
                variant="filled"
                sx={{ width: "100%" }}
                onClose={handleSnackbarClose}
            >
                {error}
            </Alert>
        </Snackbar>
    );
}

export default ErrorSnackbar;
