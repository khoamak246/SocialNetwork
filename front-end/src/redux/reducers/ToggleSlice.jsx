import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const ToggleSlice = createSlice({
  initialState,
  name: "toogle",
  reducers: {
    setOpenToggle: (state, action) => {
      return action.payload;
    },
  },
});

export const { setOpenToggle } = ToggleSlice.actions;
export default ToggleSlice.reducer;
