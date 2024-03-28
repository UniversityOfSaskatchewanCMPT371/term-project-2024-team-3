import React from "react";
import invariant from "invariant"; // Import invariant
import { useRollbar } from "@rollbar/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth";
import styles from "./Navbar.module.css";
import logoimage from "../../assets/beap_lab_hex_small.png";
import ProfileMenu from "./components/ProfileMenu";

function Navbar(): React.ReactElement | null {
    const rollbar = useRollbar();
    invariant(rollbar, "Rollbar context is not available");
    rollbar.info("Reached Navbar component");
    const { isAuthenticated } = useAuth();
    // Use invariant to check the type of isAuthenticated
    invariant(typeof isAuthenticated === "boolean", "isAuthenticated must be a boolean");

    const location = useLocation();

    if (!isAuthenticated) {
        return null;
    }

    const routes = [
        { path: "/file-upload", name: "FILE UPLOAD" },
        { path: "/processed-data", name: "PROCESSED FILES" },
        { path: "/predicted-data", name: "PREDICTED FILES" },
    ];

    return (
        <div>
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

                <ProfileMenu />
            </nav>
        </div>
    );
}

export default Navbar;
