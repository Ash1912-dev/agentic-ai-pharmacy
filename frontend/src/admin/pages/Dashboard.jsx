import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { getLowStock } from "../api/adminInventory.api";

const Dashboard = () => {
  const [lowStock, setLowStock] = useState([]);

  const loadLowStock = async () => {
    const data = await getLowStock();
    setLowStock(data);
  };

  useEffect(() => {
    loadLowStock();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* LOW STOCK CARD */}
      <div className="bg-white border rounded p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-3 text-red-600">
          ⚠️ Low Stock Alerts
        </h2>

        {lowStock.length === 0 ? (
          <p className="text-green-600">
            All medicines are sufficiently stocked.
          </p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Medicine</th>
                <th className="p-2 border">Brand</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((i) => (
                <tr key={i._id}>
                  <td className="p-2 border">
                    {i.medicine.name}
                  </td>
                  <td className="p-2 border">
                    {i.medicine.brand}
                  </td>
                  <td className="p-2 border">
                    ₹{i.medicine.price}
                  </td>
                  <td className="p-2 border text-red-600 font-semibold">
                    {i.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
