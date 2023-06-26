import {
  GET_FIND_USER,
  GET_LIST_FOLLOWER_USER_BY_USER_ID,
  GET_SUGGESTION_USER,
  GET_USER_RELATIVE_VALUE,
  POST_CREATE_USER_FOLLOWER,
  PUT_UNFOLLOW_USER,
  PUT_UPDATE_USER,
} from "../api/service/UserService";
import { setContent, setResetHomePage } from "../redux/reducers/HomePageSlice";
import { setCurrentSignInUser } from "../redux/reducers/UserSlice";
import Cookies from "universal-cookie";

export const userFindByExpectedValue = (searchingValue) => {
  return async function userFindByExpectedValueThunk(dispatch) {
    let response = await GET_FIND_USER(searchingValue);
    dispatch(setCurrentSignInUser(response.data));
    return true;
  };
};

export const putUpdateUser = (sendValue) => {
  return async function putUpdateUserThunk(dispatch) {
    let response = await PUT_UPDATE_USER(sendValue);
    return response.status === 200;
  };
};

export const findUserByRelativeValue = (value) => {
  return async function findUserByRelativeValueThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value,
    };
    let response = await GET_USER_RELATIVE_VALUE(sendValue);
    if (response.status === 200) {
      return response.data.data;
    } else if (response.status === 404) {
      return null;
    } else {
      console.log(response);
    }
  };
};

export const postCreateFollower = (followerId) => {
  return async function postCreateFollowerThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value: {
        userId: getState().user.id,
        followerId,
      },
    };
    let response = await POST_CREATE_USER_FOLLOWER(sendValue);
    if (response.status === 200) {
      dispatch(
        userFindByExpectedValue({
          value: new Cookies().get("username"),
          token: new Cookies().get("token"),
        })
      );
      return true;
    } else {
      return false;
    }
  };
};

export const putUnfollowerUser = (sendValue) => {
  return async function putUnfollowerUserThunk(dispatch, getState) {
    let response = await PUT_UNFOLLOW_USER(sendValue);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  };
};

export const getSuggestionUser = (sendValue) => {
  return async function getSuggestionUserThunk(dispatch, getState) {
    let response = await GET_SUGGESTION_USER(sendValue);
    if (response.status === 200) {
      return response.data.data;
    }
  };
};

export const getListFollowedUserByUserId = (sendValue) => {
  return async function getListFollowedUserByUserIdThunk(dispatch, getState) {
    let response = await GET_LIST_FOLLOWER_USER_BY_USER_ID(sendValue);
    if (response.status === 200) {
      return response.data.data;
    }
  };
};
