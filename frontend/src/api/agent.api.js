import axiosInstance from "./axiosInstance";

export const sendMessageToAgent = (message) => {
  return axiosInstance.post("/api/agent/message", {
    message,
  });
};

