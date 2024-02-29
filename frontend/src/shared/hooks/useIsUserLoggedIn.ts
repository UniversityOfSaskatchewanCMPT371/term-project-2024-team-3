import moment from "moment";
import { useReadLocalStorage, useLocalStorage } from "usehooks-ts";
import { useCookies } from "react-cookie";

const useIsUserLoggedIn = () => {
    const expiresAt = useReadLocalStorage("expires_at");
    const userId = useReadLocalStorage("user_id");
    const [, setExpiresAt] = useLocalStorage("expires_at", "");
    const [, setUserId] = useLocalStorage("user_id", -1);
    const [, , removeCookie] = useCookies(["SESSION"]);

    if (!expiresAt || userId === -1) {
        return false;
    }

    if (expiresAt && moment().isAfter(moment(expiresAt))) {
        setExpiresAt("");
        setUserId(-1);
        removeCookie("SESSION");
        return false;
    }

    return true;
};

export default useIsUserLoggedIn;
