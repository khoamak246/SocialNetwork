import { instance } from "../Axios";

export const POST_SIGN_UP = async (newUser) => {
  let response = await instance().post("/api/auth/signUp", newUser);
  return response;
};

export const POST_SIGN_IN = async (loginPayload) => {
  let response = await instance().post("/api/auth/signIn", loginPayload);
  return response;
};
