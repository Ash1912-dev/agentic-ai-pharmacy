import adminAxios from "./adminAxios";

export const fetchPrescriptions = async () => {
  const { data } = await adminAxios.get("/api/admin/prescriptions");
  return data;
};

export const verifyPrescription = async (id) => {
  const { data } = await adminAxios.patch(
    `/api/admin/prescriptions/${id}/verify`
  );
  return data;
};

export const rejectPrescription = async (id) => {
  const { data } = await adminAxios.patch(
    `/api/admin/prescriptions/${id}/reject`
  );
  return data;
};
