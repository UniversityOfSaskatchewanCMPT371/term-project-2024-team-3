import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import logoimage from "../../assets/beap_lab_hex_small.jpg";
import profileimage from "../../assets/profile.jpg";

function Navbar(): React.ReactElement {
    /* Add your routes and their names here and edit as needed. These were made with test data to make sure it was functioning */

    const routes = [
        { path: "/", name: "HOME" },
        { path: "/FileUploadPage", name: "FILE UPLOAD" },
        { path: "/ProcessedDataPage", name: "PROCESSED FILES" },
        { path: "/PredictedDataPage", name: "PREDICTED FILES" },
        //    { path: "/Logout", name: "LOGOUT", className: "logout-link" },
    ];

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-nav">
                    {/* Logo on the far left */}
                    <Link to="/" className="navbar-brand">
                        <img src={logoimage} alt="beapLogo" className="navbar-logo" />
                    </Link>

                    {routes.map((route) => (
                        <div className="mr-4" key={route.path}>
                            <Link to={route.path} className="nav-link">
                                {route.name}
                            </Link>
                        </div>
                    ))}

                    <Link to="/Logout" className="navbar-profile">
                        <img
                            src={profileimage}
                            alt="profileLogo"
                            className="navbar-logo navbar-logout"
                        />
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
