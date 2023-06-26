import { instance } from "../Axios";

export const POST_CREATE_NEW_COLLECTION = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/collection",
    sendValue.value
  );
  return response;
};

export const GET_COLLECTION_BY_USER_ID = async (sendValue) => {
  let response = await instance(sendValue.token).get(
    `/api/v1/collection/user/${sendValue.value}`
  );
  return response;
};

export const POST_SAVE_POST_TO_COLLECTION = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/collection/savePost",
    sendValue.value
  );
  return response;
};

export const DELETE_POST_COLLECTION = async (sendValue) => {
  let response = await instance(sendValue.token).delete(
    `http://localhost:8080/api/v1/collection/deletePost/${sendValue.value.collectionId}/${sendValue.value.postId}`
  );
  return response;
};

export const PUT_UPDATE_COLLECTION = async (sendValue) => {
  let response = await instance(sendValue.token).put(
    `http://localhost:8080/api/v1/collection/${sendValue.value.collectionId}`,
    sendValue.value.value
  );
  return response;
};

export const DELETE_COLLECTION = async (sendValue) => {
  let response = await instance(sendValue.token).delete(
    `http://localhost:8080/api/v1/collection/${sendValue.value}`
  );
  return response;
};
