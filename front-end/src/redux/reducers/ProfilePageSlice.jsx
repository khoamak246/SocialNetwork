import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetail: null,
  post: null,
  saved: null,
};

export const ProfilePageSlice = createSlice({
  initialState,
  name: "profile",
  reducers: {
    setUserDetail: (state, action) => {
      return { ...state, userDetail: action.payload };
    },
    setPost: (state, action) => {
      return { ...state, post: action.payload };
    },
    setStory: (state, action) => {
      return { ...state, story: action.payload };
    },
    setSaved: (state, action) => {
      return { ...state, saved: action.payload };
    },
    setResetProfile: (state, action) => {
      return {
        userDetail: null,
        post: null,
        saved: null,
      };
    },
  },
});

export const { setUserDetail, setPost, setStory, setSaved, setResetProfile } =
  ProfilePageSlice.actions;
export default ProfilePageSlice.reducer;
