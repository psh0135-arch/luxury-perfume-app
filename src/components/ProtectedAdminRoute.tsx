import { Navigate } from "react-router-dom";
import { hasAdminAccount, isLoggedIn } from "@/lib/adminAuth";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!hasAdminAccount()) return <Navigate to="/admin/setup" replace />;
  if (!isLoggedIn()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default ProtectedAdminRoute;
