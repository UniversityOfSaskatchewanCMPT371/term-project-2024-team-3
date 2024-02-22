import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type RequireAuthProps = {
  children: ReactElement | null;
};

export default function RequireAuth({
  children,
}: RequireAuthProps): ReactElement | null {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return children;
}
