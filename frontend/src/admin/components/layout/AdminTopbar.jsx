import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

const AdminTopbar = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-3">
      <h1 className="font-semibold text-lg">
        Welcome, {admin?.name}
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminTopbar;
