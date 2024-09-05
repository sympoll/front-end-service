import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { keycloak, authenticated } = useAuth();

  const enableAuth = import.meta.env.VITE_ENABLE_AUTH === "auth-enabled";

  // If authentication is disabled, render children directly
  if (!enableAuth) {
    return children;
  }

  // If Keycloak is still initializing
  if (keycloak?.authenticated === undefined) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the children
  if (authenticated) {
    return children;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" />;
}

export default ProtectedRoute;
