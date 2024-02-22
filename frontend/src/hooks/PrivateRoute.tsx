// Importing necessary libraries and hooks
import React from "react";
import { Route, useNavigate, RouteProps } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Define a type for the props that the PrivateRoute component accepts
type PrivateRouteProps = {
  path: string; // The path of the route
  element: React.ReactElement; // The component to render when the route is matched
} & RouteProps; // Extend from RouteProps to include all standard Route props

// PrivateRoute is a component that wraps around the standard Route component and adds authentication checking.
function PrivateRoute({ element, path }: PrivateRouteProps) {
  // Use the useAuth hook to get the current authentication state
  const { isAuthenticated } = useAuth();

  // useNavigate is a hook from react-router-dom that returns a function to navigate between different routes
  const navigate = useNavigate();

  // If the user is not authenticated, redirect them to the login page and don't render the route
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // If the user is authenticated, render the route as normal
  return <Route path={path} element={element} />;
}

// Export the PrivateRoute component for use in other files
export default PrivateRoute;
