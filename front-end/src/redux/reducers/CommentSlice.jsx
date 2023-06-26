import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nestedId: 0,
  commentAuthName: "",
};

export const CommentSlice = createSlice({
  initialState,
  name: "comment",
  reducers: {
    setNewNestedState: (state, action) => {
      return action.payload;
    },
    setResetCommentState: (state, action) => {
      return {
        nestedId: 0,
        commentAuthName: "",
      };
    },
  },
});
export const { setNewNestedState, setResetCommentState } = CommentSlice.actions;
export default CommentSlice.reducer;
