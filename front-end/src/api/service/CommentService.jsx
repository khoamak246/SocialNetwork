import { instance } from "../Axios";

export const POST_CREATE_NEW_COMMENT = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/comment",
    sendValue.value
  );
  return response;
};

export const POST_CREATE_NEW_NESTED_COMMENT = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/comment/nestedComment",
    sendValue.value
  );
  return response;
};

export const POST_CREATE_LIKE_COMMENT = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/comment/likeComment",
    sendValue.value
  );
  return response;
};

export const POST_DISLIKE_LIKE_COMMENT = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/comment/dislikeComment",
    sendValue.value
  );
  return response;
};
