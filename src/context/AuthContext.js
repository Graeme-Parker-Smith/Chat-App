import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import chatApi from "../api/requester";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("Account");
  } else {
    navigate("Signin");
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = dispatch => async ({ username, password }) => {
  try {
    const response = await chatApi.post("/signup", { username, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("Account");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up"
    });
  }
};

const signin = dispatch => async ({ username, password }) => {
  // navigate('Account');
  try {
    const response = await chatApi.post("/signin", { username, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("Account");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up"
    });
  }
};

const signout = dispatch => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("Signin");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
