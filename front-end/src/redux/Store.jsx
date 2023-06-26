import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import UserSlice from "./reducers/UserSlice";
import AuthSlice from "./reducers/AuthSlice";
import ToggleSlice from "./reducers/ToggleSlice";
import PostSlice from "./reducers/PostSlice";
import ProfilePageSlice from "./reducers/ProfilePageSlice";
import HomePageSlice from "./reducers/HomePageSlice";
import CommentSlice from "./reducers/CommentSlice";
import RoomSlice from "./reducers/RoomSlice";
import StorySlice from "./reducers/StorySlice";

const Store = configureStore({
  reducer: {
    user: UserSlice,
    auth: AuthSlice,
    toggle: ToggleSlice,
    post: PostSlice,
    profile: ProfilePageSlice,
    homePage: HomePageSlice,
    comment: CommentSlice,
    room: RoomSlice,
    story: StorySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default Store;
