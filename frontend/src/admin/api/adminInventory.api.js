import adminAxios from "./adminAxios";

export const fetchInventory = async () => {
  const { data } = await adminAxios.get("/api/admin/inventory");
  return data;
};

export const addStock = async (payload) => {
  const { data } = await adminAxios.post(
    "/api/admin/inventory/add",
    payload
  );
  return data;
};

export const setInventoryStock = async (payload) => {
  const { data } = await adminAxios.post(
    "/api/admin/inventory/set",
    payload
  );
  return data;
};

export const getLowStock = async () => {
  const { data } = await adminAxios.get(
    "/api/admin/inventory/low-stock"
  );
  return data;
};
