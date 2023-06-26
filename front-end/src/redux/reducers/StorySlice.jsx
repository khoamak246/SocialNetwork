import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const StorySlice = createSlice({
  initialState,
  name: "story",
  reducers: {
    setStory: (state, action) => {
      return action.payload;
    },
  },
});

export const { setStory } = StorySlice.actions;
export default StorySlice.reducer;
