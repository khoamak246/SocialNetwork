import {
  GET_ALL_USER_POST_BY_USER_ID,
  GET_FIND_POST_BY_ID,
  GET_STORY_BY_USERID_AND_DATE,
  POST_CREATE_NEW_BEHAVIOR,
  POST_DELETE_BEHAVIOR,
  POST_NEW_POST,
} from "../api/service/PostService";
import { setFindPostByUserId, setNewPost } from "../redux/reducers/PostSlice";
import Cookies from "universal-cookie";
import { updateSpecificPostInContent } from "./HomePageThunk";
import { POST_CREATE_NEW_REPORT } from "../api/service/ReportService";
import { setStory } from "../redux/reducers/StorySlice";

export const postAddNewPost = (sendValue) => {
  return async function postAddNewPostThunk(dispatch) {
    let response = await POST_NEW_POST(sendValue);
    dispatch(setNewPost(response.data));
  };
};

export const postGetCurrentUserPost = (sendValue) => {
  return async function postGetCurrentUserPostThunk(dispatch) {
    let response = await GET_ALL_USER_POST_BY_USER_ID(sendValue);
    dispatch(setFindPostByUserId(response.data));
  };
};

export const postCreateNewBehavior = ({ post, type }) => {
  return async function postCreateNewBehaviorThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value: {
        postId: post.id,
        userId: getState().user.id,
        type: type,
      },
    };
    let response = await POST_CREATE_NEW_BEHAVIOR(sendValue);
    if (response.status === 200) {
      dispatch(updateSpecificPostInContent(post));
      return true;
    } else {
      console.log(response);
      return false;
    }
  };
};

export const postDeleteBehavior = ({ post, type }) => {
  return async function postDeleteBehaviorThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value: {
        postId: post.id,
        userId: getState().user.id,
        type,
      },
    };
    let response = await POST_DELETE_BEHAVIOR(sendValue);
    if (response.status === 200) {
      dispatch(updateSpecificPostInContent(post));
    } else {
      console.log(response);
    }
  };
};

export const getPostById = (value) => {
  return async function getPostByIdThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value,
    };
    let response = await GET_FIND_POST_BY_ID(sendValue);
    if (response.status === 200) {
      return response.data.data;
    } else {
      console.log(response);
    }
  };
};

export const postReportPost = (sendValue) => {
  return async function postReportPostThunk(dispatch, getState) {
    let response = await POST_CREATE_NEW_REPORT(sendValue);
    if (response.status === 200) {
      return true;
    } else {
      console.log(response);
      return false;
    }
  };
};

export const getStoryInDay = (sendValue) => {
  return async function getStoryInDayThunk(dispatch, getState) {
    let response = await GET_STORY_BY_USERID_AND_DATE(sendValue);
    if (response.status === 200) {
      dispatch(setStory(response.data.data));
      return true;
    } else {
      console.log(response);
      return false;
    }
  };
};
