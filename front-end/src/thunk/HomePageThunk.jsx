import {
  GET_FIND_POST_BY_ID,
  POST_CREATE_HOME_PAGE_POST_COLLECTION,
} from "../api/service/PostService";
import {
  setContent,
  setIsStillHavingContent,
} from "../redux/reducers/HomePageSlice";
import Cookies from "universal-cookie";

export const postCreateHomePagePostCollection = (sendValue) => {
  return async function postCreateHomePagePostCollectionThunk(
    dispatch,
    getState
  ) {
    let response = await POST_CREATE_HOME_PAGE_POST_COLLECTION(sendValue);
    let { homePage } = getState();
    if (response.status === 200) {
      let data = response.data.data;
      if (data.length > 0) {
        // if (data.length === homePage.pageSortingFetching.size) {
        //   let currentContent = [...homePage.content, ...data];
        //   dispatch(setContent(currentContent));
        // }
        let currentContent = [...homePage.content, ...data];
        dispatch(setContent(currentContent));
      } else {
        let currentContent = [...homePage.content, ...data];
        dispatch(setContent(currentContent));
        dispatch(setIsStillHavingContent(false));
      }
    } else {
      dispatch(setIsStillHavingContent(false));
    }
  };
};

export const updateSpecificPostInContent = (post) => {
  return async function updateSpecificPostInContentThunk(dispatch, getState) {
    let { homePage } = getState();
    let index = homePage.content.indexOf(post);
    let fetchingPostId = post.id;
    let sendValue = {
      token: new Cookies().get("token"),
      value: fetchingPostId,
    };
    let response = await GET_FIND_POST_BY_ID(sendValue);

    if (response.status === 200) {
      let contentArrTemp = [...homePage.content];
      contentArrTemp[index] = response.data.data;
      dispatch(setContent(contentArrTemp));
    } else {
      console.log(response);
    }
  };
};
