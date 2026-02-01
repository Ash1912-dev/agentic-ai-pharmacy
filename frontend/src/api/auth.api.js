import axiosInstance from "./axiosInstance";

export const signupUser = (data) =>
  axiosInstance.post("/api/auth/signup", data);

export const loginUser = (data) =>
  axiosInstance.post("/api/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/api/auth/me");

export const logoutUser = () =>
  axiosInstance.post("/api/auth/logout");
