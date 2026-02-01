import axiosInstance from "./axiosInstance";

export const sendMessageToAgent = (userId, message) => {
  return axiosInstance.post("/api/agent/message", {
    userId,
    message,
  });
};

