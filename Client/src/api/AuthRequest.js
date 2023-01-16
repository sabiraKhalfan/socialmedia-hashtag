import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

export const logIn = (formData) => API.post("/auth/login", formData);
export const signUp = (formData) => API.post("/auth/register", formData);
export const verify = (userId, token) =>
  API.put("/auth/verify", { userId, token });
export const resendVerification = (userId) =>
  API.post(`/auth/resendVerification/${userId}`);
