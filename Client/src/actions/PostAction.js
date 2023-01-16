import * as PostApi from "../api/PostRequest";
import toast from "react-hot-toast";

export const createPost = (data) => async (dispatch) => {
  dispatch({ type: "POST_PENDING" });
  try {
    const response = await PostApi.createPost(data);
    dispatch({ type: "POST_SUCCESS", payload: response.data.newPost });
    dispatch({ type: "UPDATE_POST_COUNT", payload: 1 });
    toast(response.data.message, {
      icon: "⌛",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  } catch (err) {
    if (err.response?.data?.expired) {
      return dispatch({ type: "LOGOUT" });
    }
    dispatch({ type: "POST_FAIL" });
    err.response?.data?.message &&
      toast(err.response.data.message, {
        icon: "😢",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    console.log(err);
  }
};

export const deletePost = (id) => async (dispatch) => {
  dispatch({ type: "POST_PENDING" });
  try {
    const response = await PostApi.deletePost(id);
    dispatch({ type: "POST_DELETE_SUCCESS", payload: response.data.id });
    dispatch({ type: "UPDATE_POST_COUNT", payload: -1 });
    //toast
    toast(response.data.message, {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  } catch (err) {
    if (err.response?.data?.expired) {
      return dispatch({ type: "LOGOUT" });
    }
    dispatch({ type: "POST_FAIL" });
    console.log(err);
    err.response?.data?.message &&
      toast(err.response.data.message, {
        icon: "😢",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
  }
};

export const reportPost = (id, type) => async (dispatch) => {
  dispatch({ type: "POST_PENDING" });
  try {
    await PostApi.reportPost(id, type);
    dispatch({ type: "REPORT_POST", payload: id });
    toast("Successfully reported", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  } catch (err) {
    dispatch({ type: "POST_FAIL" });
    console.log(err);
    err.response?.data?.message &&
      toast(err.response.data.message, {
        icon: "😢",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
  }
};
