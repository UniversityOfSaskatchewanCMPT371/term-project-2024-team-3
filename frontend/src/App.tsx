import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./Home";
import Logout from "./Logout";
import FileUpload from "./FileUpload";
import ProcessedDataPage from "./pages/processedDataPage";
import PredictedFiles from "./PredictedFiles";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Logout" element={<Logout />} />

        {/* Protected Routes */}
        {/* This tag is to be added when the implementation of authentication is to be created */}
        {/*<Route element={<RequireAuth type={"user"} />}></Route>*/}
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/processedDataPage" element={<ProcessedDataPage />} />
        <Route path="/PredictedFiles" element={<PredictedFiles />} />
      </Routes>
    </Router>
  );
};

export default App;
