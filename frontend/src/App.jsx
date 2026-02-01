import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";

function App() {
  return (
    <>
      {/* User App Routes */}
      <AppRoutes />

      {/* Admin App Routes */}
      <AdminAuthProvider>
        <AdminRoutes />
      </AdminAuthProvider>
    </>
  );
}

export default App;
