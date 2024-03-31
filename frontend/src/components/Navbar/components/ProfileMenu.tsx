import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import profileimage from "assets/profile.jpg";
import styles from "../Navbar.module.css";

type Props = {
    onLogout: () => void;
};

export default function ProfileMenu({ onLogout }: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (link: string) => {
        setAnchorEl(null);
        navigate(link);
    };

    return (
        <div className={styles["navbar-profile"]}>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <img
                    src={profileimage}
                    alt="profileLogo"
                    data-testid="profile"
                    className={`${styles["navbar-logo"]} ${styles["navbar-logout"]}`}
                />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={() => handleNavigate("/profile")}>My account</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
