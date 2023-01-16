import API from "../config/axios";

export const getUserDetails = (id) => API.get(`/user/${id}`);
export const updateProfile = (id, formData) => API.put(`/user/${id}`, formData);
export const getAllUsers = () => API.get("/user");
export const getNotifications = () => API.get(`/user/notifications`);
export const clearNotifications = (id) =>
  API.put(`/user/${id}/clearNotifications`);
