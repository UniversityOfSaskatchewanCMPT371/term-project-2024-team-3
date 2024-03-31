import React from "react";
import invariant from "invariant"; // Import invariant
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth";
import styles from "./Navbar.module.css";
import logoimage from "../../assets/beap_lab_hex_small.png";
import LoadingModal from "../LoadingModal/LoadingModal";
import useLogout from "../../shared/hooks/useLogout";
import ProfileMenu from "./components/ProfileMenu";

function Navbar(): React.ReactElement | null {
    const { handleLogout, isLoading: logoutLoading } = useLogout();

    const { isAuthenticated } = useAuth();

    // Use invariant to check the type of isAuthenticated
    invariant(typeof isAuthenticated === "boolean", "isAuthenticated must be a boolean");

    const location = useLocation();

    if (!isAuthenticated) {
        return null;
    }

    const onLogout = async () => {
        await handleLogout();
    };

    const routes = [
        { path: "/file-upload", name: "FILE UPLOAD" },
        { path: "/processed-data", name: "PROCESSED FILES" },
        { path: "/predicted-data", name: "PREDICTED FILES" },
    ];

    return (
        <div>
            <LoadingModal
                header="Please wait while we are logging you out!"
                isVisible={logoutLoading}
            />
            <nav className={styles.navbar}>
                <Link to="/" className={styles["navbar-brand"]}>
                    <img src={logoimage} alt="beapLogo" className={styles["navbar-logo"]} />
                </Link>

                <div className={styles["navbar-nav"]}>
                    {routes.map((route) => (
                        <div className="mr-4" key={route.path}>
                            <Link
                                to={route.path}
                                className={`${styles["nav-link"]} ${location.pathname === route.path ? styles.active : ""}`}
                            >
                                {route.name}
                            </Link>
                        </div>
                    ))}
                </div>

                <ProfileMenu onLogout={onLogout} />
            </nav>
        </div>
    );
}

export default Navbar;
