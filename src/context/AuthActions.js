export const loginStart = (userCredentials) => ({
  type: "LOGIN_START",
});
export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});
export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});
export const registerStart = (userCredentials) => ({
  type: "LOGIN_START",
});
export const registerSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});
export const registerFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});
export const Follow = (useId) => ({
  type: "FOLLOW",
  payload: useId,
});
export const Unfollow = (useId) => ({
  type: "UNFOLLOW",
  payload: useId,
});
