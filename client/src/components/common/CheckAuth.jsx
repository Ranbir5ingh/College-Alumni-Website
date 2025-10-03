// components/common/CheckAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Constants for account statuses and roles
const ACCOUNT_STATUS = {
  INCOMPLETE_PROFILE: "incomplete_profile",
  PENDING_VERIFICATION: "pending_verification",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

const USER_ROLES = {
  ALUMNI: "alumni",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

/**
 * A wrapper component to check authentication, authorization, and account status.
 * @param {object} children - The child elements to render if checks pass.
 */
function CheckAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Define route paths
  const authRoutePrefix = "/auth";
  const alumniRoutePrefix = "/alumni";
  const adminRoutePrefix = "/admin";
  const completeProfilePath = "/alumni/complete-profile";
  const pendingVerificationPath = "/alumni/pending-verification";
  
  // Check if current path starts with specific prefixes
  const isAdminRoute = location.pathname.startsWith(adminRoutePrefix);
  const isAlumniRoute = location.pathname.startsWith(alumniRoutePrefix);
  const isAuthRoute = location.pathname.startsWith(authRoutePrefix);

  // Check if the current route is one of the status-specific pages
  const isStatusPage = 
    location.pathname === completeProfilePath ||
    location.pathname === pendingVerificationPath;

  // --- 1. UNAUTHENTICATED USERS ---
  
  // Protected Routes: alumni/* and admin/* require authentication
  if (!isAuthenticated && (isAlumniRoute || isAdminRoute)) {
    // Save the intended destination to redirect back after login
    // This is a common pattern, though the state isn't used in this component's logic
    return <Navigate to={authRoutePrefix} state={{ from: location }} replace />;
  }
  
  // --- 2. AUTHENTICATED USERS (Authorization & Status Checks) ---

  if (isAuthenticated && user) {
    const { accountStatus, role } = user;
    
    // a. Authorization Check for Admin Routes
    const isAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
    
    if (isAdminRoute && !isAdmin) {
      // User is authenticated but is not an admin, redirect to alumni dashboard
      return <Navigate to="/alumni/dashboard" replace />;
    }

    // b. Account Status Redirection (Only applies to alumni routes, not auth/admin/status pages)
    if (isAlumniRoute && !isAdmin && !isStatusPage) {
      // Redirect users based on their account status
      if (accountStatus === ACCOUNT_STATUS.INCOMPLETE_PROFILE) {
        return <Navigate to={completeProfilePath} replace />;
      }
      
      // if (accountStatus === ACCOUNT_STATUS.PENDING_VERIFICATION || accountStatus === ACCOUNT_STATUS.REJECTED) {
      //   // Redirect to pending verification or a status page if account is rejected/pending
      //   return <Navigate to={pendingVerificationPath} replace />;
      // }
      
      // Verified users continue to the alumni route
    }
    
    // c. Prevent Access to Auth Pages
    if (isAuthRoute) {
      // If user is logged in, redirect them away from login/register
      const dashboardPath = isAdmin ? "/admin/dashboard" : "/alumni/dashboard";
      return <Navigate to={dashboardPath} replace />;
    }

    // d. Redirect from Home Page (/)
    if (location.pathname === "/") {
      const dashboardPath = isAdmin ? "/admin/dashboard" : "/alumni/dashboard";
      return <Navigate to={dashboardPath} replace />;
    }
  }

  // --- 3. PUBLIC ACCESS AND FALLTHROUGH ---
  
  // If all checks pass (e.g., public route, or authenticated user on allowed page), 
  // render the requested component.
  return <>{children}</>;
}

export default CheckAuth;