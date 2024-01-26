import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar(): React.ReactElement {
  /* Add your routes and their names here and edit as needed. These were made with test data to make sure it was functioning */

  const routes = [
    { path: "/", name: "HOME" },
    { path: "/FileUpload", name: "FILE UPLOAD" },
    { path: "/ProcessedDataPage", name: "PROCESSED FILES" },
    { path: "/PredictedFiles", name: "PREDICTED FILES" },
    { path: "/Logout", name: "LOGOUT", className: "logout-link" },
  ];

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-success-light">
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {routes.map((route) => (
              <div className="mr-4" key={route.path}>
                <Link to={route.path} className="nav-link">
                  {route.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
