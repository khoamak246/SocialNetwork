import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUserSignInSelector } from "../../redux/selectors/Selector";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import { useCookies } from "react-cookie";
import { setDefaultAuthState } from "../../redux/reducers/AuthSlice";
import { setResetCommentState } from "../../redux/reducers/CommentSlice";
import { setResetHomePage } from "../../redux/reducers/HomePageSlice";
import { setResetDefaultPost } from "../../redux/reducers/PostSlice";
import { setResetProfile } from "../../redux/reducers/ProfilePageSlice";
import { setResetRoom } from "../../redux/reducers/RoomSlice";
import { setStory } from "../../redux/reducers/StorySlice";
import { setResetUser } from "../../redux/reducers/UserSlice";
import { postCreateFollower } from "../../thunk/UserThunk";
import { toast } from "react-hot-toast";
import { TbCircleCheck } from "react-icons/tb";
import Cookies from "js-cookie";

export default function FollowSuggestion({ user, type }) {
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [isFollower, setIsFollower] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookie, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    if (currentUserSignIn) {
      let { follower } = currentUserSignIn;
      follower.forEach((val) => {
        if (user && val.id === user.id) {
          return setIsFollower(true);
        }
      });
    }
  }, [user]);

  const handleFollowUser = () => {
    dispatch(postCreateFollower(user.id)).then((res) => {
      if (res) {
        toast.success("Follow successfully!", { duration: 2000 });
        setIsFollower(true);
      }
    });
  };

  const handleLogout = () => {
    dispatch(setResetUser());
    dispatch(setDefaultAuthState());
    dispatch(setResetCommentState());
    dispatch(setResetHomePage());
    dispatch(setResetDefaultPost());
    dispatch(setResetProfile());
    dispatch(setResetRoom());
    dispatch(setStory(null));
    dispatch(setOpenToggle(null));
    removeCookie("token");
    removeCookie("username");
    removeCookie("password");
  };

  return (
    <div
      className={`flex justify-between items-center ${
        type === "search" && "hover:px-2 py-1 cursor-pointer"
      } transition-all duration-200`}
    >
      <div
        className="flex gap-4 items-center cursor-pointer"
        onClick={() => {
          navigate(`/profile/${user.id}/post`);
          dispatch(setOpenToggle(null));
        }}
      >
        <div
          className={`rounded-full ${
            currentUserSignIn.id === user.id ? "w-16 h-16" : "w-10 h-10"
          }`}
        >
          <div
            className={`rounded-full overflow-hidden ring-[2px] ring-white ${
              currentUserSignIn.id === user.id ? "w-14 h-14" : "h-10"
            }`}
          >
            <img
              className="w-full h-full"
              src={`${user?.userInfo.avatar}`}
              alt=""
            />
          </div>
        </div>
        <div className="w-[80%]">
          <p className="font-semibold">
            {currentUserSignIn.id === user?.id
              ? currentUserSignIn.email.split("@")[0]
              : user?.fullName}
          </p>
          <div className="h-[20px] w-full text-ellipsis overflow-hidden">
            <p className="text-sm text-[#737373]">
              {type !== "search"
                ? currentUserSignIn.id === user?.id
                  ? currentUserSignIn.fullName
                  : isFollower
                  ? "Followed"
                  : "Recommend for you"
                : user?.userInfo.introduce}
            </p>
          </div>
        </div>
      </div>
      <div className={`${currentUserSignIn.id !== user.id && "hidden"}`}>
        <p
          className="text-sm text-blue-600 font-semibold cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
      <div
        className={`${
          (currentUserSignIn.id === user.id ||
            isFollower ||
            type === "search") &&
          "hidden"
        }`}
        onClick={handleFollowUser}
      >
        <p className={`text-sm text-blue-600 font-semibold cursor-pointer`}>
          follow
        </p>
      </div>
      <div
        className={`${
          (currentUserSignIn.id === user.id ||
            !isFollower ||
            type === "search") &&
          "hidden"
        }`}
        onClick={() => navigate(`/profile/${user.id}/post`)}
      >
        <TbCircleCheck className="text-sm text-green-500 font-semibold cursor-pointer" />
      </div>
    </div>
  );
}
