import React, { Fragment, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute(props: ProtectedRouteProps): React.ReactElement {
  const { children } = props;
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default ProtectedRoute;
