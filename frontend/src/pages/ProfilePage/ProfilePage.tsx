import { Box, Container, Stack } from "@mui/material";
import React, { useState } from "react";
import "./profile.css";
import ConfirmModal from "components/ConfirmModal/ConfirmModal";

function ProfilePage(): React.ReactElement | null {
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const onAccountDeletionConfirm = () => {
        console.log("Account deleted");
        setIsDeleteAccountModalOpen(false);
    };

    const onDataDeletionConfirm = () => {
        console.log("Data deleted");
        setIsDeleteDataModalOpen(false);
    };

    return (
        <Container className="profile">
            <ConfirmModal
                isVisible={isDeleteAccountModalOpen}
                header="Confirm Account Deletion"
                content="Deleting your account deletes all of your associated data and login information. Are you sure you want to delete your account? You won't be able to login again."
                onClose={() => setIsDeleteAccountModalOpen(false)}
                onConfirm={onAccountDeletionConfirm}
                preventOutsideClick
            />
            <ConfirmModal
                isVisible={isDeleteDataModalOpen}
                header="Confirm Data Deletion"
                content="Deleting your data deletes all of your associated data. Are you sure you want to delete your data?"
                onClose={() => setIsDeleteDataModalOpen(false)}
                onConfirm={onDataDeletionConfirm}
                preventOutsideClick
            />
            <h5 className="profile-subheading">Manage your account</h5>
            <h1>Your account details</h1>
            <Box>
                <h5>Personal information</h5>
                <hr />
                <form>
                    <div>
                        <label htmlFor="firstname" className="label">
                            First Name
                        </label>
                        <input id="firstname" type="text" placeholder="" value="" disabled />
                    </div>
                    <div>
                        <label htmlFor="lastname" className="label">
                            Last Name
                        </label>
                        <input id="lastname" type="text" placeholder="" value="" disabled />
                    </div>
                </form>
            </Box>
            <Box>
                <h5>Login information</h5>
                <hr />
                <div>
                    <label htmlFor="username" className="label">
                        Username
                    </label>
                    <input id="username" type="text" placeholder="" value="" disabled />
                </div>
                {changePassword && (
                    <>
                        <div>
                            <label htmlFor="password" className="label">
                                New Password
                            </label>
                            <input id="password" type="text" placeholder="" value="" disabled />
                        </div>
                        <div>
                            <label htmlFor="username" className="label">
                                Confirm Password
                            </label>
                            <input id="username" type="text" placeholder="" value="" disabled />
                        </div>
                    </>
                )}
                {!changePassword && (
                    <button
                        id="changePassBtn"
                        data-testid="changePassBtn"
                        type="button"
                        className="edit-btn button"
                        onClick={() => setChangePassword(true)}
                    >
                        Change My Password
                    </button>
                )}
                {changePassword && (
                    <button
                        id="updatePassBtn"
                        data-testid="updatePassBtn"
                        type="button"
                        className="edit-btn button"
                        onClick={() => console.log("changed password")}
                    >
                        Update My Password
                    </button>
                )}
            </Box>
            <Box>
                <h5>Advanced</h5>
                <hr />
                <Stack direction="row" spacing={2}>
                    <button
                        id="deleteAccBtn"
                        type="button"
                        data-testid="deleteAccBtn"
                        className="delete-btn button"
                        onClick={() => setIsDeleteAccountModalOpen(true)}
                    >
                        Delete My Account
                    </button>

                    <button
                        id="deleteDataBtn"
                        type="button"
                        data-testid="deleteDataBtn"
                        className="delete-btn button"
                        onClick={() => setIsDeleteDataModalOpen(true)}
                    >
                        Delete My Data
                    </button>
                </Stack>
            </Box>
        </Container>
    );
}

export default ProfilePage;
