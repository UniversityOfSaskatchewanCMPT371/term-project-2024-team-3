import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./Logout";
import ProcessedDataPage from "./pages/ProcessDataPage/ProcessedDataPage";
import PredictedDataPage from "./pages/PredictedDataPage/PredictedDataPage";
import FileUploadPage from "./pages/FileUploadPage/FileUploadPage";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import Loginpage from "./pages/LoginPage/LoginPage";

const rollbarConfig = {
  accessToken: "dbfced96b5df42d295242681f0560764",
  environment: "testenv",
  captureUncaught: true,
  captureUnhandledRejections: true,
};

function App(): React.ReactElement<typeof Router> {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Loginpage />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/FileUpload" element={<FileUploadPage />} />

            {/* Protected Routes */}
            {/* This tag is to be added when the implementation of authentication is to be created */}
            {/* <Route element={<RequireAuth type={"user"} />}></Route> */}
            <Route path="/ProcessedDataPage" element={<ProcessedDataPage />} />
            <Route path="/PredictedDataPage" element={<PredictedDataPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
