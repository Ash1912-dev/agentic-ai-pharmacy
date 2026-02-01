import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  return admin ? children : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;
