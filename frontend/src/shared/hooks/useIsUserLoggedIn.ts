import { useEffect } from "react";
import moment from "moment";
import { useCookies } from "react-cookie";

const useIsUserLoggedIn = () => {
    const expiresAt = localStorage.getItem("expires_at");
    const userId = localStorage.getItem("user_id");
    const [, , removeCookie] = useCookies(["SESSION"]);

    useEffect(() => {
        const expired =
            expiresAt &&
            moment()
                .utc()
                .isAfter(moment(expiresAt?.replace(/"/g, "")).utc());

        if (expired) {
            localStorage.removeItem("expires_at");
            localStorage.removeItem("user_id");
            removeCookie("SESSION");
            window.location.reload();
        }
    }, [expiresAt, removeCookie]);

    return !!expiresAt && userId !== null;
};

export default useIsUserLoggedIn;
