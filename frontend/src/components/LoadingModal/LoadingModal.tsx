import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import "./loading-modal.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type Props = {
    header: string;
    isVisible: boolean;
};

function LoadingModal({ header, isVisible }: Props): React.ReactElement | null {
    return (
        <Modal
            open={isVisible}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="loading-modal">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {header}
                </Typography>
                <Box className="spinner-modal">
                    <LoadingSpinner loading />
                </Box>
            </Box>
        </Modal>
    );
}

export default LoadingModal;
