const initialState = {
  posts: [],
  loading: false,
  uploading: false,
  error: false,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case "POST_PENDING":
      return {
        ...state,
        uploading: true,
        error: false,
      };
    case "POST_SUCCESS":
      //checking whether the post is scheduled or not
      if (!action.payload.scheduledDate) {
        return {
          ...state,
          posts: [action.payload, ...state.posts],
          uploading: false,
          error: false,
        };
      } else {
        return {
          ...state,
          uploading: false,
          error: false,
        };
      }

    case "POST_FAIL":
      return {
        ...state,
        uploading: false,
        error: true,
      };

    case "POST_DELETE_SUCCESS":
      return {
        ...state,
        posts: [...state.posts.filter((post) => post._id !== action.payload)],
        uploading: false,
        error: false,
      };
    case "RESET_POSTS":
      return initialState;

    case "FETCH_POSTS":
      return {
        ...state,
        loading: false,
        uploading: false,
        error: false,
        posts: [...state.posts, ...action.payload],
      };

    case "REPORT_POST":
      return {
        ...state,
        loading: false,
        error: false,
        posts: [...state.posts.filter((post) => post._id !== action.payload)],
      };

    default:
      return state;
  }
};

export default postReducer;
