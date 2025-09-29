// components/common/CheckAuth.jsx
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children }) {
  const location = useLocation();

  // List of protected routes that require authentication
  const protectedRoutes = ["/alumni"];
  
  // List of auth routes (login/register pages)
  const authRoutes = ["/auth"];

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // If user is NOT authenticated and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return <Navigate to="/auth" replace />;
  }

  // If user IS authenticated and trying to access auth pages (login/register)
  // Redirect them to their dashboard
  if (isAuthenticated && isAuthRoute) {
    return <Navigate to="/alumni/dashboard" replace />;
  }

  // If user IS authenticated and on home page, redirect to dashboard
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/alumni/dashboard" replace />;
  }

  // Otherwise, render the children (the requested page)
  return <>{children}</>;
}

export default CheckAuth;