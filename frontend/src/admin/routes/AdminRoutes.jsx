import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import Medicines from "../pages/Medicines";
import Inventory from "../pages/Inventory";
import Prescriptions from "../pages/Prescriptions";
import Orders from "../pages/Orders";
import AdminProtectedRoute from "../components/common/AdminProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        }
      />

      <Route path="/admin/medicines" element={<AdminProtectedRoute><Medicines /></AdminProtectedRoute>} />
      <Route path="/admin/inventory" element={<AdminProtectedRoute><Inventory /></AdminProtectedRoute>} />
      <Route path="/admin/prescriptions" element={<AdminProtectedRoute><Prescriptions /></AdminProtectedRoute>} />
      <Route path="/admin/orders" element={<AdminProtectedRoute><Orders /></AdminProtectedRoute>} />
    </Routes>
  );
};

export default AdminRoutes;
