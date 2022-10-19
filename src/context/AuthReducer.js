const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        errorTxt: "",
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        errorTxt: "",
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
        errorTxt: action.payload.response.data,
      };
    case "REGISTER_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        errorTxt: "",
      };
    case "REGISTER_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
        errorTxt: "",
      };
    case "REGISTER_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
        errorTxt: action.payload.response.data,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (followingItem) => followingItem !== action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;
