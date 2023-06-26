import Cookies from "universal-cookie";
import {
  POST_CREATE_LIKE_COMMENT,
  POST_CREATE_NEW_COMMENT,
  POST_CREATE_NEW_NESTED_COMMENT,
  POST_DISLIKE_LIKE_COMMENT,
} from "../api/service/CommentService";
import { updateSpecificPostInContent } from "./HomePageThunk";

export const createNewComment = ({ post, content }) => {
  return async function createNewCommentThunk(dispatch, getState) {
    let sendvalue = {
      token: new Cookies().get("token"),
      value: {
        content,
        userId: getState().user.id,
        postId: post.id,
      },
    };
    let respone = await POST_CREATE_NEW_COMMENT(sendvalue);
    if (respone.status === 200) {
      dispatch(updateSpecificPostInContent(post));
    } else {
      console.log(respone);
    }
  };
};

export const createNewNestedComment = ({ post, content }) => {
  return async function createNewNestedCommentThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value: {
        nestedId: getState().comment.nestedId,
        content,
        userId: getState().user.id,
        postId: post.id,
      },
    };

    let response = await POST_CREATE_NEW_NESTED_COMMENT(sendValue);
    if (response.status === 200) {
      dispatch(updateSpecificPostInContent(post));
    } else {
      console.log(response);
    }
  };
};

export const createLikeComment = ({ post, commentId }) => {
  return async function createLikeCommentThunk(dispatch, getState) {
    let sendvalue = {
      token: new Cookies().get("token"),
      value: {
        userId: getState().user.id,
        commentId,
      },
    };

    let response = await POST_CREATE_LIKE_COMMENT(sendvalue);
    if (response.status === 200) {
      dispatch(updateSpecificPostInContent(post));
    } else {
      console.log(response);
    }
  };
};

export const dislikeComment = ({ post, commentId }) => {
  return async function dislikeCommentThunk(dispatch, getState) {
    let sendvalue = {
      token: new Cookies().get("token"),
      value: {
        userId: getState().user.id,
        commentId,
      },
    };

    let response = await POST_DISLIKE_LIKE_COMMENT(sendvalue);
    if (response.status === 200) {
      dispatch(updateSpecificPostInContent(post));
    } else {
      console.log(response);
    }
  };
};
