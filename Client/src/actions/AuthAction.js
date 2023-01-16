import { toast } from "react-hot-toast";
import * as AuthApi from "../api/AuthRequest";

export const logIn = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "AUTH_FAIL", payload: err.response?.data });
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

export const signUp = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "AUTH_FAIL", payload: err.response?.data });
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

export const verifyAccount = (userId, token) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.verify(userId, token);
    dispatch({ type: "VERIFY_USER", payload: data });
  } catch (err) {
    dispatch({ type: "AUTH_FAIL", payload: err.response?.data });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: "LOGOUT" });
};
