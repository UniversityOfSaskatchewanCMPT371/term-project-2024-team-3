import React from "react";
import { Link } from "react-router-dom";
import { Stack } from "@mui/material";
import { useAuth } from "../Authentication/useAuth";
import "./navbar.css";
import logoimage from "../../assets/beap_lab_hex_small.jpg";
import ProfileMenu from "./components/ProfileMenu";

function Navbar(): React.ReactElement | null {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return null;
    }

    const routes = [
        { path: "/", name: "HOME" },
        { path: "/file-upload", name: "FILE UPLOAD" },
        { path: "/processed-data", name: "PROCESSED FILES" },
        { path: "/predicted-data", name: "PREDICTED FILES" },
    ];

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            className="navbar"
        >
            <Link to="/" className="navbar-brand">
                <img src={logoimage} alt="beapLogo" className="navbar-logo" />
            </Link>
            <Stack direction="row">
                {routes.map((route) => (
                    <div className="mr-4" key={route.path}>
                        <Link to={route.path} className="nav-link">
                            {route.name}
                        </Link>
                    </div>
                ))}
            </Stack>

            <ProfileMenu />
        </Stack>
    );
}

export default Navbar;
