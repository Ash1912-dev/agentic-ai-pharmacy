import axios from "../../api/axiosInstance";

export const adminLogin = async (credentials) => {
  const { data } = await axios.post("/api/admin/auth/login", credentials);
  return data;
};
