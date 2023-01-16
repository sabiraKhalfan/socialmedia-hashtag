import API from "../config/axios";

export const createPost = (data) => API.post("/post", data);
export const deletePost = (id) => API.delete(`/post/${id}`);
export const likePost = (id) => API.put(`/post/${id}/like`);
export const reportPost = (id,type)=>API.post(`/post/${id}/report`,{type})
export const editPost=(id,description)=>API.put(`/post/${id}`,{description})