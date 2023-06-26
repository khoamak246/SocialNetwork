import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const AuthSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setAuthSignUp: (state, action) => {
      return action.payload;
    },
    setAuthSignIn: (state, action) => {
      return action.payload;
    },
    setDefaultAuthState(state, action) {
      return null;
    },
  },
});

export const { setAuthSignUp, setAuthSignIn, setDefaultAuthState } =
  AuthSlice.actions;
export default AuthSlice.reducer;
