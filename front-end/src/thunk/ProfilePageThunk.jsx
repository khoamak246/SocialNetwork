import { toast } from "react-hot-toast";
import {
  DELETE_COLLECTION,
  DELETE_POST_COLLECTION,
  GET_COLLECTION_BY_USER_ID,
  POST_CREATE_NEW_COLLECTION,
  POST_SAVE_POST_TO_COLLECTION,
  PUT_UPDATE_COLLECTION,
} from "../api/service/CollectionService";
import { GET_ALL_USER_POST_BY_USER_ID } from "../api/service/PostService";
import { GET_USER_BY_ID } from "../api/service/UserService";
import {
  setPost,
  setSaved,
  setUserDetail,
} from "../redux/reducers/ProfilePageSlice";
import Cookies from "universal-cookie";
import { userFindByExpectedValue } from "./UserThunk";

// USERDETAIL
export const getUserDetail = (sendValue) => {
  return async function getUserDetailThunk(dispatch) {
    let response = await GET_USER_BY_ID(sendValue);
    if (response.status === 200) {
      dispatch(setUserDetail(response.data.data));
      return true;
    }
    return false;
  };
};

// COLLECTION

export const getPostByUserId = (sendValue) => {
  return async function getPostByUserIdThunk(dispatch) {
    let response = await GET_ALL_USER_POST_BY_USER_ID(sendValue);
    if (response.status === 200) {
      dispatch(setPost(response.data.data));
    } else if (response.status === 204) {
      dispatch(setPost(null));
    }
  };
};

export const getCollectionByUserId = (sendValue) => {
  return async function getCollectionByUserIdThunk(dispatch) {
    let response = await GET_COLLECTION_BY_USER_ID(sendValue);
    if (response.status === 200) {
      dispatch(setSaved(response.data.data));
    }
  };
};

export const postCreateNewCollection = (sendValue) => {
  return async function postCreateNewCollectionThunk(dispatch) {
    await POST_CREATE_NEW_COLLECTION(sendValue);
  };
};

export const putUpdateCollection = (sendValue) => {
  return async function putUpdateCollectionThunk(dispatch) {
    await PUT_UPDATE_COLLECTION(sendValue);
  };
};

export const savePostToCollection = ({ post, collectionId }) => {
  return async function savePostToCollectionThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value: {
        collectionId,
        postId: post.id,
      },
    };

    for (let i = 0; i < getState().user.collection.length; i++) {
      const collection = getState().user.collection[i];
      if (collection.id === collectionId) {
        for (let k = 0; k < collection.post.length; k++) {
          const postInCollection = collection.post[k];
          if (postInCollection.id == post.id) {
            toast.error("OOP! This post exist in your collection!", {
              duration: 2000,
            });
            return false;
          }
        }
      }
    }

    let response = await POST_SAVE_POST_TO_COLLECTION(sendValue);
    if (response.status === 200) {
      toast.success("Add to collection successfully!", { duration: 2000 });
      return true;
    } else {
      return false;
    }
  };
};

export const deletePostInCollection = ({ collectionId, postId }) => {
  return async function deletePostInCollectionThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      value: {
        collectionId,
        postId,
      },
    };

    let response = await DELETE_POST_COLLECTION(sendValue);
    if (response.status === 200) {
      dispatch(
        userFindByExpectedValue({
          value: new Cookies().get("username"),
          token: new Cookies().get("token"),
        })
      );
      toast.success("Delete successfully!", { duration: 2000 });
      return true;
    } else {
      return false;
    }
  };
};

export const deleteCollection = (sendValue) => {
  return async function deleteCollectionThunk(dispatch) {
    await DELETE_COLLECTION(sendValue);
  };
};
