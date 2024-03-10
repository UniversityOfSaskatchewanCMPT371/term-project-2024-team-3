// Importing necessary libraries and components
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import ProtectedRoute from "components/Authentication/ProtectedRoute";
import rollbarConfig from "shared/config/rollbar";
import Navbar from "./components/Navbar/Navbar";
import LoginForm from "./pages/LoginPage/components/LoginForm";
import Logout from "./pages/LogoutPage/Logout";
import ProcessedDataPage from "./pages/ProcessDataPage/ProcessedDataPage";
import PredictedDataPage from "./pages/PredictedDataPage/PredictedDataPage";
import FileUploadPage from "./pages/FileUploadPage/FileUploadPage";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import HelpPopup from "./components/HelpPopup/HelpPopup";
import { AuthProvider } from "./components/Authentication/useAuth";

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
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route
                                path="/ProcessedDataPage"
                                element={
                                    <ProtectedRoute>
                                        <ProcessedDataPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/PredictedDataPage"
                                element={
                                    <ProtectedRoute>
                                        <PredictedDataPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/FileUploadPage"
                                element={
                                    <ProtectedRoute>
                                        <FileUploadPage />
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
