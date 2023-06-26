import { instance } from "../Axios";

export const POST_NEW_POST = async (postValue) => {
  let response = await instance(postValue.token).post(
    "/api/v1/post",
    postValue.sendValue
  );
  return response;
};

export const GET_ALL_USER_POST_BY_USER_ID = async (getValue) => {
  let response = await instance(getValue.token).get(
    `/api/v1/post/userPost/${getValue.value}`
  );
  return response;
};

export const GET_FIND_STORY_BY_ID = async (findValue) => {
  let response = await instance(findValue.token).get(
    `/api/v1/post/story/${findValue.storyId}`,
    findValue.id
  );
  return response;
};

export const POST_CREATE_HOME_PAGE_POST_COLLECTION = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    `/api/v1/post/pagingPost`,
    sendValue.value
  );
  return response;
};

export const POST_CREATE_NEW_BEHAVIOR = async (sendValue) => {
  let response = await instance(sendValue.token).post(
    "/api/v1/post/postBehavior",
    sendValue.value
  );
  return response;
};

export const POST_DELETE_BEHAVIOR = async (sendValue) => {
  let response = await instance(sendValue.token).delete(
    "/api/v1/post/postBehavior",
    {
      data: sendValue.value,
    }
  );
  return response;
};

export const GET_FIND_POST_BY_ID = async (sendvalue) => {
  let response = await instance(sendvalue.token).get(
    `/api/v1/post/${sendvalue.value}`
  );
  return response;
};

export const GET_STORY_BY_USERID_AND_DATE = async (sendvalue) => {
  let response = await instance(sendvalue.token).post(
    `/api/v1/post/storyInDay`,
    sendvalue.value
  );
  return response;
};
