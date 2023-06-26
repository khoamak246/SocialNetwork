import { instance } from "../Axios";

export const POST_CREATE_NEW_REPORT = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/report",
    sendValue.value
  );
  return response;
};
