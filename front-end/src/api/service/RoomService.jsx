import { instance } from "../Axios";

export const GET_LIST_ROOM_BY_USER_ID = async (sendValue) => {
  let response = await instance(sendValue.token).get(
    `/api/v1/userRoom/getByUserId/${sendValue.userId}`
  );
  return response;
};

export const POST_CREATER_NEW_ROOM = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/userRoom",
    sendValue.value
  );
  return response;
};

export const PUT_UPDATE_LAST_ACCESS = async (sendValue) => {
  let response = await instance(sendValue.token).put(
    `/api/v1/userRoom/updateLasted/${sendValue.userRoomId}`
  );
  return response;
};
