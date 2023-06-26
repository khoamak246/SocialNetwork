import { createSlice } from "@reduxjs/toolkit";
import React from "react";

const initialState = {
  id: "",
  username: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  roles: [],
  userInfo: {
    avatar: "",
    createdDate: "",
    birthDay: "",
    gender: "",
    lastLogin: "",
    introduce: "",
  },
  follower: [],
};

export const UserSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    setCurrentSignInUser: (state, action) => {
      return action.payload.data;
    },
    setResetUser: (state, action) => {
      return {
        id: "",
        username: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        roles: [],
        userInfo: {
          avatar: "",
          createdDate: "",
          birthDay: "",
          gender: "",
          lastLogin: "",
          introduce: "",
        },
        follower: [],
      };
    },
  },
});

export const { setCurrentSignInUser, setResetUser } = UserSlice.actions;

export default UserSlice.reducer;
