/* eslint-disable react/require-default-props */
import { Box, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import "./confirm-modal.css";

type Props = {
    header: string;
    content: string;
    isVisible: boolean;
    onConfirm: () => void;
    onClose: () => void;
    preventOutsideClick?: boolean;
    isLoading?: boolean;
};

function ConfirmModal({
    header,
    content,
    isVisible,
    onConfirm,
    onClose,
    preventOutsideClick = false,
    isLoading = false,
}: Props): React.ReactElement | null {
    return (
        <Modal
            open={isVisible}
            onClose={preventOutsideClick ? undefined : onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="confirm-modal">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {header}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {content}
                </Typography>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1}
                    marginTop={2}
                >
                    <button
                        id="changePassBtn"
                        data-testid="changePassBtn"
                        type="button"
                        className="cancel-btn button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        id="changePassBtn"
                        data-testid="changePassBtn"
                        type="button"
                        className="confirm-btn button"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Confirm
                    </button>
                </Stack>
            </Box>
        </Modal>
    );
}

export default ConfirmModal;
