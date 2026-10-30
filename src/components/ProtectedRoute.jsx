import { Navigate, Outlet, useLocation } from "react-router";
import { Spin } from "antd";
import { useAuth } from "../providers/AuthProvider";

function FullPageSpinner() {
   return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
         <Spin size="large" />
      </div>
   );
}

export function ProtectedRoute() {
   const { isAuthenticated, loading } = useAuth();
   const location = useLocation();

   if (loading) return <FullPageSpinner />;
   if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;
   return <Outlet />;
}

export function PublicOnlyRoute({ children }) {
   const { isAuthenticated, loading } = useAuth();

   if (loading) return <FullPageSpinner />;
   if (isAuthenticated) return <Navigate to="/home" replace />;
   return children;
}