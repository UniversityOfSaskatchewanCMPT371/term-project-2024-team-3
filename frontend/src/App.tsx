// Importing necessary libraries and components
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import ProtectedRoute from "components/Authentication/ProtectedRoute";
import PrivacyPolicy from "components/PrivacyPolicy/PrivacyPolicy";
import AboutUs from "pages/AboutUs/AboutUs";
import SignUpPage from "pages/SignUpPage/SignUpPage";
import rollbarConfig from "shared/config/rollbar";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import ProfilePage from "pages/ProfilePage/ProfilePage";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./pages/LogoutPage/Logout";
import ProcessedDataPage from "./pages/ProcessDataPage/ProcessedDataPage";
import PredictedDataPage from "./pages/PredictedDataPage/PredictedDataPage";
import FileUploadPage from "./pages/FileUploadPage/FileUploadPage";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import HelpPopup from "./components/HelpPopup/HelpPopup";
import { AuthProvider } from "./components/Authentication/useAuth";
import LoginPage from "./pages/LoginPage/LoginPage";

function App(): React.ReactElement<typeof Router> {
    return (
        <Provider config={rollbarConfig}>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <Navbar />
                        <HelpPopup />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/about-us" element={<AboutUs />} />

                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/loading" element={<LoadingSpinner loading />} />
                            <Route
                                path="/processed-data"
                                element={
                                    <ProtectedRoute>
                                        <ProcessedDataPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/predicted-data"
                                element={
                                    <ProtectedRoute>
                                        <PredictedDataPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/file-upload"
                                element={
                                    <ProtectedRoute>
                                        <FileUploadPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </ErrorBoundary>
            </AuthProvider>
        </Provider>
    );
}

// Exporting the App component
export default App;
