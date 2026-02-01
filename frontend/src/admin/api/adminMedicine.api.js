import adminAxios from "./adminAxios";

export const fetchMedicines = () =>
  adminAxios.get("/api/admin/medicines").then(r => r.data);

export const createMedicine = (data) =>
  adminAxios.post("/api/admin/medicines", data).then(r => r.data);

export const updateMedicine = (id, data) =>
  adminAxios.put(`/api/admin/medicines/${id}`, data).then(r => r.data);

export const toggleMedicine = (id) =>
  adminAxios.patch(`/api/admin/medicines/${id}/toggle`).then(r => r.data);
