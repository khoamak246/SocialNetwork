import { instance } from "../Axios";

export const GET_FIND_USER = async (searchingValue) => {
  let response = await instance(searchingValue.token).get(
    `/api/v1/user/searchAbsoluteValue/${searchingValue.value}`
  );
  return response;
};

export const GET_USER_BY_ID = async (sendValue) => {
  let response = await instance(sendValue.token).get(
    `/api/v1/user/${sendValue.userId}`,
    sendValue.userId
  );
  return response;
};

export const GET_USER_RELATIVE_VALUE = async (sendValue) => {
  let response = await instance(sendValue.token).get(
    `/api/v1/user/searchRelativeValue/${sendValue.value}`
  );
  return response;
};

export const POST_CREATE_USER_FOLLOWER = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/user/follower/create",
    sendValue.value
  );

  return response;
};

export const PUT_UPDATE_USER = async (sendValue) => {
  let response = await instance(sendValue.token).put(
    `/api/v1/user/${sendValue.userId}`,
    sendValue.value
  );
  return response;
};

export const PUT_UNFOLLOW_USER = async (sendValue) => {
  let response = await instance(sendValue.token).put(
    `/api/v1/user/unfollow/${sendValue.userId}/${sendValue.followerId}`
  );
  return response;
};

export const GET_SUGGESTION_USER = async (sendValue) => {
  let response = await instance(sendValue.token).get(
    `/api/v1/user/suggestionUser/${sendValue.userId}`
  );
  return response;
};

export const GET_LIST_FOLLOWER_USER_BY_USER_ID = async (sendValue) => {
  let response = await instance(sendValue.token).get(
    `/api/v1/user/getListFollowedUser/${sendValue.userId}`
  );
  return response;
};
