import React from "react";
import { screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { renderWithProvider } from "shared/util/tests/render";
import Navbar from "./components/Navbar/Navbar";

test(" TID 1.4. renders all links", () => {
    renderWithProvider(
        <Router>
            <Navbar />
        </Router>,
    );

    const homeLink = screen.getByText(/HOME/i);
    expect(homeLink).toBeInTheDocument();

    const fileUploadLink = screen.getByText(/FILE UPLOAD/i);
    expect(fileUploadLink).toBeInTheDocument();

    const processedFilesLink = screen.getByText(/PROCESSED FILES/i);
    expect(processedFilesLink).toBeInTheDocument();

    const predictedFilesLink = screen.getByText(/PREDICTED FILES/i);
    expect(predictedFilesLink).toBeInTheDocument();

    const logoutLink = screen.getByText(/LOGOUT/i);
    expect(logoutLink).toBeInTheDocument();
});
