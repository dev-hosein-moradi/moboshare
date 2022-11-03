import axios from "axios";

/* function for login process */
export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  const baseUri = process.env.REACT_APP_BASE_API;
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      baseUri + "auth/login",
      userCredentials,
      axiosConfig
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

/* function for signIn process */
export const registerCall = async (userCredentials, dispatch) => {
  dispatch({ type: "REGISTER_START" });
  const baseUri = process.env.REACT_APP_BASE_API;
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(userCredentials);
  try {
    const res = await axios.post(
      baseUri + "auth/register",
      userCredentials,
      axiosConfig
    );
    dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "REGISTER_FAILURE", payload: err });
  }
};
