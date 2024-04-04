import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useRollbar } from "@rollbar/react";
import ConfirmModal from "components/ConfirmModal/ConfirmModal";
import useGetUser from "shared/hooks/useGetUser";
import useDeleteAccount from "shared/hooks/useDeleteAccount";
import useDeleteData from "shared/hooks/useDeleteData";
import useChangePassword from "shared/hooks/useChangePassword";
import ErrorSnackbar from "components/ErrorSnackbar/ErrorSnackbar";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import "./profile.css";

function ProfilePage(): React.ReactElement<typeof Container> {
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);
    const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const { user, error: userError, isLoading: userLoading } = useGetUser();
    const {
        handleAccountDelete,
        error: deleteAccError,
        isLoading: deleteAccLoading,
    } = useDeleteAccount();
    const {
        handleDataDelete,
        error: dataDeleteError,
        isLoading: dataDeleteLoading,
    } = useDeleteData();
    const {
        handleChangePassword,
        error: passChangeError,
        isLoading: passChangeLoading,
    } = useChangePassword();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const rollbar = useRollbar();

    const validatePasswords = () => {
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError(null);
        }
    };

    const onAccountDeletionConfirm = async () => {
        await handleAccountDelete();
        rollbar.info(`${user?.username} user has been deleted`);
        setIsDeleteAccountModalOpen(false);
    };

    const onDataDeletionConfirm = async () => {
        await handleDataDelete();
        rollbar.info(`${user?.username} user data has been deleted`);
        setIsDeleteDataModalOpen(false);
    };

    const onPasswordChangeConfirm = async () => {
        await handleChangePassword(confirmPassword);
        rollbar.info(`${user?.username} user changed their password`);
        setIsPasswordChangeModalOpen(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    if (userLoading) {
        return <LoadingSpinner loading={userLoading} />;
    }

    return (
        <Container className="profile">
            <ErrorSnackbar error={userError} />
            <ErrorSnackbar error={deleteAccError} />
            <ErrorSnackbar error={dataDeleteError} />
            <ErrorSnackbar error={passChangeError} />
            <ConfirmModal
                isVisible={isPasswordChangeModalOpen}
                header="Confirm Password Change"
                content={
                    passChangeLoading
                        ? "Please wait while we are changing your password"
                        : "Are you sure you want to change your password?"
                }
                onClose={() => setIsPasswordChangeModalOpen(false)}
                onConfirm={onPasswordChangeConfirm}
                preventOutsideClick={passChangeLoading}
                isLoading={passChangeLoading}
            />
            <ConfirmModal
                isVisible={isDeleteAccountModalOpen}
                header="Confirm Account Deletion"
                content={
                    deleteAccLoading
                        ? "Please wait while we are deleting your account"
                        : "Deleting your account deletes all of your associated data and login information. Are you sure you want to delete your account? You won't be able to login again."
                }
                onClose={() => setIsDeleteAccountModalOpen(false)}
                onConfirm={onAccountDeletionConfirm}
                preventOutsideClick={deleteAccLoading}
                isLoading={deleteAccLoading}
            />
            <ConfirmModal
                isVisible={isDeleteDataModalOpen}
                header="Confirm Data Deletion"
                content={
                    dataDeleteLoading
                        ? "Please wait while we are deleting your data"
                        : "Deleting your data deletes all of your associated data. Are you sure you want to delete your data?"
                }
                onClose={() => setIsDeleteDataModalOpen(false)}
                onConfirm={onDataDeletionConfirm}
                preventOutsideClick={dataDeleteLoading}
                isLoading={dataDeleteLoading}
            />
            <h5 className="profile-subheading">Manage your account</h5>
            <h1>Your account details</h1>
            <Box>
                <h5>Personal information</h5>
                <hr />
                <Stack spacing={2}>
                    <Stack direction="row" spacing={1}>
                        <span className="label">First Name:</span>
                        <span>{user?.firstName}</span>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <span className="label">Last Name:</span>
                        <span>{user?.lastName}</span>
                    </Stack>
                </Stack>
            </Box>
            <Box>
                <h5>Login information</h5>
                <hr />
                <Stack direction="row" spacing={1}>
                    <span className="label">Username:</span>
                    <span>{user?.username}</span>
                </Stack>
            </Box>
            <Box marginTop={1}>
                {changePassword && (
                    <>
                        <div className="textField">
                            <label htmlFor="new-password" className="label">
                                New Password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={validatePasswords}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="label">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                placeholder=""
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onBlur={validatePasswords}
                            />
                        </div>
                        {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
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
                        onClick={() => setIsPasswordChangeModalOpen(true)}
                        disabled={!!passwordError}
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
