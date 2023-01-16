import API from "../config/axios";

export const getFollowers = (id) => API.get(`/user/followers/${id}`);
export const followUser = (id) => API.put(`/user/${id}/follow`);
export const unFollowUser = (id) => API.put(`/user/${id}/unFollow`);
