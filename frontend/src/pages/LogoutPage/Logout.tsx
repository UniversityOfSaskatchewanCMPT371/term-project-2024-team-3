import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../shared/hooks/useLogout";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"; // adjust the path as needed

function Logout(): React.ReactElement | null {
    const navigate = useNavigate();
    const { handleLogout, isLoading, error } = useLogout();

    useEffect(() => {
        const logoutAndRedirect = async () => {
            await handleLogout();
            navigate("/");
        };

        logoutAndRedirect();
    }, [handleLogout, navigate]);

    if (isLoading) {
        return (
            <div>
                <p>Logging out...</p>
                <LoadingSpinner loading={isLoading} />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>; // Handle error state
    }

    return null; // or redirect to a different page
}

export default Logout;
