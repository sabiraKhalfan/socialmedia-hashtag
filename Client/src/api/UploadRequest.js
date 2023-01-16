import API from "../config/axios";

export const uploadImage = (data) => API.post("/upload/image", data);
export const uploadVideo = (data) => API.post("/upload/video", data);
