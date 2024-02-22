// Importing necessary libraries and components
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import Navbar from "./components/Navbar/Navbar";
import LoginForm from "./pages/LoginPage/components/LoginForm";
import Logout from "./Logout";
import ProcessedDataPage from "./pages/ProcessDataPage/ProcessedDataPage";
import PredictedDataPage from "./pages/PredictedDataPage/PredictedDataPage";
import FileUploadPage from "./pages/FileUploadPage/FileUploadPage";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import RequireAuth from "./hooks/RequireAuth";

// Configuration for Rollbar, a real-time error tracking system
const rollbarConfig = {
  accessToken: "dbfced96b5df42d295242681f0560764",
  environment: "testenv",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

// Main App component
function App(): React.ReactElement<typeof Router> {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            {/* Protected Routes */}
            {/* This tag is to be added when the implementation of authentication is to be created */}
            <Route
              element={
                // RequireAuth is a higher-order component that checks if a user is authenticated
                <RequireAuth>
                  <>
                    <Route
                      path="/ProcessedDataPage"
                      element={<ProcessedDataPage />}
                    />
                    <Route
                      path="/PredictedDataPage"
                      element={<PredictedDataPage />}
                    />
                    <Route
                      path="/FileUploadPage"
                      element={<FileUploadPage />}
                    />
                  </>
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

// Exporting the App component
export default App;
