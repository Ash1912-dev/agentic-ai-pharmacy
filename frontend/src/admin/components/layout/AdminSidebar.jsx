import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-blue-100 transition";

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 text-xl font-bold border-b">
        Admin Panel
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/medicines" className={linkClass}>
          Medicines
        </NavLink>
        <NavLink to="/admin/inventory" className={linkClass}>
          Inventory
        </NavLink>
        <NavLink to="/admin/prescriptions" className={linkClass}>
          Prescriptions
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
