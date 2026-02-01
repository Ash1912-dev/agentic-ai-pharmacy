import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  fetchOrders,
  updateOrderStatus,
} from "../api/adminOrder.api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const loadOrders = async () => {
    setOrders(await fetchOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter);

  const badge = (status) => {
    if (status === "CONFIRMED") return "bg-green-100 text-green-700";
    if (status === "WAITING_PRESCRIPTION")
      return "bg-yellow-100 text-yellow-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    if (status === "FULFILLED") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>

        <select
          className="border px-3 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="WAITING_PRESCRIPTION">
            Waiting Prescription
          </option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="FULFILLED">Fulfilled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Medicine</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id}>
                <td className="p-3 border">
                  <div className="font-medium">
                    {o.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {o.user?.phone}
                  </div>
                </td>

                <td className="p-3 border">
                  {o.medicine?.name}
                  <div className="text-sm text-gray-500">
                    ₹{o.medicine?.price}
                  </div>
                </td>

                <td className="p-3 border">{o.quantity}</td>

                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${badge(
                      o.status
                    )}`}
                  >
                    {o.status}
                  </span>
                </td>

                <td className="p-3 border">
                  {o.status === "CONFIRMED" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(o._id, "FULFILLED").then(
                          loadOrders
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Mark Fulfilled
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Orders;
