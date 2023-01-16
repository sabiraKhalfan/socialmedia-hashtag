const initialState = {
  authData: null,
  loading: false,
  error: false,
  message: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: false, message: null };

    case "AUTH_SUCCESS":
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        authData: action.payload,
        loading: false,
        error: false,
        message: null,
      };
    case "AUTH_FAIL":
      return {
        ...state,
        loading: false,
        error: true,
        message: action?.payload?.message,
      };

    case "VERIFY_USER":
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            isVerified: action.payload.success,
          },
        },
        loading: false,
        error: false,
        message: null,
      };

    case "RESET":
      return {
        ...state,
        loading: false,
        error: false,
        message: null,
      };

    case "UPDATE_PENDING":
      return {
        ...state,
        loading: false,
        error: true,
      };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        authData: action.payload,
      };

    case "UPDATE_FAIL":
      return {
        ...state,
        loading: false,
        error: true,
      };

    case "UPDATE_POST_COUNT":
      return {
        ...state,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            totalPosts: state.authData.user.totalPosts + action.payload,
          },
        },
      };

    case "FOLLOW_SUCCESS":
      return {
        ...state,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            following: [...state.authData.user.following, action.payload],
          },
        },
      };

    case "UN_FOLLOW_SUCCESS":
      return {
        ...state,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            following: [
              ...state.authData.user.following.filter(
                (userId) => userId !== action.payload
              ),
            ],
          },
        },
      };

    default:
      return state;
  }
};

export default authReducer;
