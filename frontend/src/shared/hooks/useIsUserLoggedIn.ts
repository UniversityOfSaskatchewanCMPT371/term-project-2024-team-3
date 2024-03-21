import { useEffect } from "react";
import moment from "moment";
import { useCookies } from "react-cookie";
import { useRollbar } from "@rollbar/react";

const useIsUserLoggedIn = () => {
    const expiresAt = localStorage.getItem("expires_at");
    const userId = localStorage.getItem("user_id");
    const [, , removeCookie] = useCookies(["SESSION"]);
    const rollbar = useRollbar();

    useEffect(() => {
        rollbar.info("Checking if user is logged in...");
        const expired =
            expiresAt &&
            moment()
                .utc()
                .isAfter(moment(expiresAt?.replace(/"/g, "")).utc());

        if (expired) {
            rollbar.info("Login session has expired.");
            localStorage.removeItem("expires_at");
            localStorage.removeItem("user_id");
            removeCookie("SESSION");
            window.location.reload();
        } else {
            rollbar.info("Login session is still valid.");
        }
    }, [expiresAt, removeCookie]);

    return !!expiresAt && userId !== null;
};

export default useIsUserLoggedIn;
