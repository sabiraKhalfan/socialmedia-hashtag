import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import postReducer from "./PostReducer";
import userReducer from "./UserReducer";

const appReducers = combineReducers({
  authReducer,
  postReducer,
  userReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    localStorage.clear();
    return appReducers(undefined, action);
  }
  return appReducers(state, action);
};

export default rootReducer;
