import adminAxios from "./adminAxios";

export const fetchOrders = async () => {
  const { data } = await adminAxios.get("/api/admin/orders");
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await adminAxios.patch(
    `/api/admin/orders/${id}/status`,
    { status }
  );
  return data;
};
