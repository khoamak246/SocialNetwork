import { toast } from "react-hot-toast";
import { POST_SIGN_UP, POST_SIGN_IN } from "../api/service/AuthService";
import { setAuthSignUp, setAuthSignIn } from "../redux/reducers/AuthSlice";

export function authSignUp(user) {
  return async function authSignUpThunk(dispatch) {
    const response = await POST_SIGN_UP(user);
    dispatch(setAuthSignUp(response.data));
  };
}

export function authSignIn(loginPayload) {
  return async function authSignInThunk(dispatch) {
    const response = await POST_SIGN_IN(loginPayload);
    dispatch(setAuthSignIn(response.data));
  };
}
