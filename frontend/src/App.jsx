import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        <AdminAuthProvider>
          <AdminRoutes />
        </AdminAuthProvider>
      ) : (
        <AppRoutes />
      )}
    </>
  );
}

export default App;
