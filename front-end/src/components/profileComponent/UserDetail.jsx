import React, { useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import {
  currentUserSignInSelector,
  profilePostSelector,
  profileUserDetailSelector,
  toggleSelector,
} from "../../redux/selectors/Selector";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import EditProfileModal from "../Modal/EditProfileModal";
import { getUserDetail } from "../../thunk/ProfilePageThunk";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import {
  RiArrowDownSLine,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import {
  getListFollowedUserByUserId,
  postCreateFollower,
  putUnfollowerUser,
} from "../../thunk/UserThunk";

export default function UserDetail() {
  const param = useParams();
  const dispatch = useDispatch();
  const [cookie] = useCookies();
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const profileUserDetail = useSelector(profileUserDetailSelector);
  const toggleSelect = useSelector(toggleSelector);
  const navigate = useNavigate();
  const profilePost = useSelector(profilePostSelector);
  const [follower, setFollower] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let sendValue = {
        token: cookie.token,
        userId: param.userId,
      };
      dispatch(getListFollowedUserByUserId(sendValue)).then((res) => {
        if (res) {
          setFollower(res);
        }
      });
      dispatch(getUserDetail(sendValue)).then((res) => {
        if (!res) {
          navigate("*");
        }
      });
    };

    fetchData();
  }, [param]);
  console.log(isFollowed);
  useEffect(() => {
    if (profileUserDetail) {
      follower.forEach((val) => {
        if (val.id === currentUserSignIn.id) {
          return setIsFollowed(true);
        }
      });
    }
  }, [profileUserDetail]);

  return (
    <div className="py-10">
      <div className="flex justify-center items-center gap-32">
        <div onClick={() => dispatch(setOpenToggle("editProfile"))}>
          <img
            className="w-40 h-40 rounded-full cursor-pointer"
            src={`${profileUserDetail?.userInfo.avatar}`}
            alt=""
            draggable={false}
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 items-center">
            <p className="text-xl cursor-default">
              {profileUserDetail?.fullName}
            </p>
            <div
              className={`${
                param.userId != currentUserSignIn.id && "hidden"
              } bg-[#EFEFEF] py-1 px-3 rounded-lg cursor-pointer hover:bg-[#DBDBDB] duration-100 transition-all`}
              onClick={() => dispatch(setOpenToggle("editProfile"))}
            >
              <p className="font-semibold">Edit Profile</p>
            </div>
            <div
              className={`${
                (param.userId == currentUserSignIn.id || isFollowed) && "hidden"
              } bg-[#0095F6] py-1 px-3 rounded-lg cursor-pointer hover:bg-[#1877F2] duration-100 transition-all flex items-center gap-2`}
              onClick={() => {
                dispatch(postCreateFollower(profileUserDetail.id)).then(
                  (res) => {
                    if (res) {
                      setFollower(setIsFollowed(true));
                    }
                  }
                );
              }}
            >
              <p className="font-semibold text-center text-white">Follow</p>
              <RiUserUnfollowLine className="text-white" />
            </div>

            <div
              className={`${
                (param.userId == currentUserSignIn.id || !isFollowed) &&
                "hidden"
              } bg-[#EFEFEF] py-1 px-3 rounded-lg cursor-pointer hover:bg-[#DBDBDB] duration-100 transition-all flex items-center gap-2`}
              onClick={() => {
                let sendValue = {
                  token: cookie.token,
                  userId: currentUserSignIn.id,
                  followerId: profileUserDetail.id,
                };
                dispatch(putUnfollowerUser(sendValue)).then((res) => {
                  if (res) {
                    setFollower(setIsFollowed(false));
                  }
                });
              }}
            >
              <p className="font-semibold text-center">Followed</p>
              <RiUserFollowLine />
            </div>

            <p
              className={`${param.userId != currentUserSignIn.id && "hidden"}`}
            >
              <TbCircleDashed className="text-xl cursor-pointer" />
            </p>
          </div>
          <div className="flex gap-16">
            <p className="cursor-default">
              <span className="font-semibold">
                {profilePost ? profilePost.length : 0}
              </span>{" "}
              posts
            </p>
            <p className="cursor-pointer">
              <span className="font-semibold">{follower?.length}</span> follower
            </p>
            <p className="cursor-pointer">
              <span className="font-semibold">
                {" "}
                {profileUserDetail?.follower.length}
              </span>{" "}
              following
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold cursor-default">
              {profileUserDetail?.userInfo.introduce}
            </p>
          </div>
        </div>
      </div>
      {toggleSelect === "editProfile" && <EditProfileModal />}
    </div>
  );
}
