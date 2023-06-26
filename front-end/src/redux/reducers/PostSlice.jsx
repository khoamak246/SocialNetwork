import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const PostSlice = createSlice({
  initialState,
  name: "post",
  reducers: {
    setNewPost: (state, action) => {
      console.log(action.payload);
      return action.payload;
    },
    setFindPostByUserId: (state, action) => {
      return action.payload.data;
    },
    setResetDefaultPost: (state, action) => {
      return null;
    },
  },
});

export const { setNewPost, setFindPostByUserId, setResetDefaultPost } =
  PostSlice.actions;
export default PostSlice.reducer;
