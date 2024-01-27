import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Navbar";

test(" TID 1.5. renders all links", () => {
  render(
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
