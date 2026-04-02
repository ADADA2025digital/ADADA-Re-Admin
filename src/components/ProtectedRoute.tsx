import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if token exists in localStorage
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    // Redirect to login page if token is missing
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if token is present
  return <>{children}</>;
}
