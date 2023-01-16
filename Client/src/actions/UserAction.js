import { toast } from "react-hot-toast";
import * as UserApi from "../api/UserRequest";

export const getUserDetails = (id) => async (dispatch) => {
  dispatch({ type: "USER_DATA_PENDING" });
  try {
    const response = await UserApi.getUserDetails(id);
    dispatch({ type: "USER_DATA_SUCCESS", payload: response.data });
  } catch (err) {
    if (err.response?.data?.expired) {
      return dispatch({ type: "LOGOUT" });
    }
    dispatch({ type: "USER_DATA_FAIL" });
    console.log(err);
  }
};

export const updateProfile = (id, formData) => async (dispatch) => {
  dispatch({ type: "UPDATE_PENDING" });
  try {
    const { data } = await UserApi.updateProfile(id, formData);
    dispatch({ type: "UPDATE_SUCCESS", payload: data });
  } catch (err) {
    if (err.response?.data?.expired) {
      return dispatch({ type: "LOGOUT" });
    }
    dispatch({ type: "UPDATE_FAIL" });
    console.log(err);
  }
};

export const getNotifications = () => async (dispatch) => {
  try {
    const response = await UserApi.getNotifications();
    dispatch({ type: "FETCH_NOTIFICATIONS", payload: response.data });
  } catch (err) {
    if (err.response?.data?.expired) {
      return dispatch({ type: "LOGOUT" });
    }
    console.log(err);
  }
};

export const clearNotifications = (id) => async (dispatch) => {
  try {
    const response = await UserApi.clearNotifications(id);
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
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
    console.log(err);
  }
};
