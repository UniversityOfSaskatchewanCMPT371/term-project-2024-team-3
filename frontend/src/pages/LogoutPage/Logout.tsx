import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../shared/hooks/useLogout";

function Logout() {
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
        return <div>Logging out...</div>; // This can be replaced in the future with a loading spinner
    }

    if (error) {
        return <div>{error}</div>; // Handle error state
    }

    return null; // or redirect to a different page
}

export default Logout;
