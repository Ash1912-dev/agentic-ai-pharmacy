// ========================================
// frontend/src/pages/Orders.jsx
// ========================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { ShoppingCart, Clock, Package, AlertCircle, Loader, Bell } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAiChatEnabled =
    String(import.meta.env.VITE_AI_CHAT_ENABLED ?? "true").toLowerCase() === "true";
  const aiPausedMode = localStorage.getItem("aiPausedMode") === "true";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/api/orders/my");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "emerald";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "✓";
      case "pending":
        return "⏱";
      case "cancelled":
        return "✕";
      default:
        return "●";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 px-4 py-12">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/50 mb-4 backdrop-blur">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">Order History</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-emerald-200/80">
            Track your medicine orders and set intake reminders
          </p>

          {(!isAiChatEnabled || aiPausedMode) && (
            <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/40">
              <p className="text-sm text-yellow-100">
                AI chat is paused in this hosted mode. You can still place quick manual orders and continue setting reminders normally.
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-300">Loading your orders...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="p-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-center">
            <ShoppingCart className="w-16 h-16 text-emerald-400/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-emerald-300 mb-2">No orders yet</h2>
            <p className="text-emerald-200/60 mb-6">Start by searching for medicines or uploading a prescription</p>
            <button
              onClick={() => navigate("/medicines")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Medicines
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order._id}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/40 hover:border-emerald-300/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 pb-4 border-b border-emerald-400/20">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/30 rounded-lg">
                          <Package className="w-6 h-6 text-emerald-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {order.medicine?.name || "Medicine"}
                          </h3>
                          <p className="text-sm text-emerald-200/60 mt-1">
                            Order ID: {order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-emerald-200/60 mb-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold bg-${statusColor}-500/20 text-${statusColor}-300 border border-${statusColor}-400/40`}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-emerald-200/60 mb-1">Quantity</p>
                        <p className="text-lg font-bold text-emerald-300">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-200/60 mb-1">Price per unit</p>
                        <p className="text-lg font-bold text-emerald-300">₹{order.medicine?.price || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-200/60 mb-1">Total</p>
                        <p className="text-lg font-bold text-teal-300">₹{(order.quantity * (order.medicine?.price || 0)).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() =>
                        navigate("/reminders", {
                          state: {
                            orderId: order._id,
                            medicine: order.medicine,
                          },
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      <Bell className="w-5 h-5" />
                      Set Intake Reminder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
