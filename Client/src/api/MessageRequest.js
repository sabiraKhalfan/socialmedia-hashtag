import API from "../config/axios";

export const getMessages = (roomId) => API.get(`/message/${roomId}`);
export const addNewMessage = (message) => API.post(`/message`, message);
