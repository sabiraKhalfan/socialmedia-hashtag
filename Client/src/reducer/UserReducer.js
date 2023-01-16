const initialState = {
  userDetails: null,
  notifications: [],
  error: false,
  loading: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_DATA_PENDING":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "USER_DATA_SUCCESS":
      return {
        ...state,
        userDetails: { ...action.payload },
        loading: false,
        error: false,
      };
    case "USER_DATA_FAIL":
      return {
        ...state,
        userDetails: null,
        loading: false,
        error: true,
      };

    case "FETCH_NOTIFICATIONS":
      return {
        ...state,
        notifications: [...action.payload.notifications],
      };
    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

export default userReducer;
