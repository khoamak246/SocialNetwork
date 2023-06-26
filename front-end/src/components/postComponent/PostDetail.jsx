import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import InputComment from "../commentComponent/InputComment";
import BehaviorIcon from "./BehaviorIcon";
import CommentText from "../commentComponent/CommentText";
import Slider from "../slider/Slider";
import { useLocation, useParams } from "react-router-dom";
import { getPostById } from "../../thunk/PostThunk";
import { formatPostNumber } from "../../utils/util";
import PostOptionModal from "../Modal/PostOptionModal";
import { userFindByExpectedValue } from "../../thunk/UserThunk";
import { useCookies } from "react-cookie";
import { authSignIn } from "../../thunk/AuthThunk";
import {
  authAuthenticationState,
  currentUserSignInSelector,
  homePageContentSelector,
} from "../../redux/selectors/Selector";
import { setContent } from "../../redux/reducers/HomePageSlice";

export default function PostDetail() {
  const [listMeida, setListMedia] = useState([]);
  const [displayData, setDisplayData] = useState(null);
  const [tooglePostOptionModal, setTogglePostOptionModal] = useState(false);
  const authenticationState = useSelector(authAuthenticationState);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const homeContent = useSelector(homePageContentSelector);
  const [cookie, setCookie] = useCookies();
  const [isLike, setLike] = useState(false);
  const param = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSave, setSave] = useState(false);
  console.log(displayData);

  useEffect(() => {
    dispatch(getPostById(param.postId)).then((res) => {
      for (let i = 0; i < homeContent.length; i++) {
        const element = homeContent[i];
        if (element.id == res.id) {
          setDisplayData(element);
          return true;
        }
      }
      let data = [...homeContent, res];
      dispatch(setContent(data));
    });
  }, [param, location.pathname]);

  useEffect(() => {
    Array.isArray(homeContent) &&
      setDisplayData(homeContent[homeContent.length - 1]);
  }, [homeContent]);

  useEffect(() => {
    if (displayData) {
      let listImgTemp = [];
      displayData.postImg.forEach((val) => {
        if (val.type) {
          listImgTemp.push({
            url: val.url,
            type: "img",
          });
        } else {
          listImgTemp.push({
            url: val.url,
            type: "video",
          });
        }
      });
      setListMedia(listImgTemp);
    }

    if (
      displayData &&
      displayData.postBehavior.length !== 0 &&
      currentUserSignIn.id !== ""
    ) {
      displayData.postBehavior.forEach((val) => {
        setLike(val.type === "like" && val.users.id === currentUserSignIn.id);
      });
    } else {
      setLike(false);
    }
  }, [displayData]);

  return (
    <div
      className={`z-50 w-full h-full flex justify-center items-center overflow-hidden duration-300 transition-al`}
    >
      <div
        className={`w-[70%] h-[90%] bg-white flex rounded duration-300 transition-all overflow-hidden z-20 border`}
      >
        <div
          className={`w-[50%] bg-black flex justify-center items-center overflow-hidden`}
        >
          <Slider listMeida={listMeida} />
        </div>
        <div className={`w-[50%]`}>
          <div className="w-full h-[10%] flex items-center border-b px-4">
            <div></div>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-1">
                <img
                  draggable={false}
                  className="h-8 w-8 rounded-full"
                  src={`${displayData?.user.userInfo.avatar}`}
                />
                <div className="ml-3 ">
                  <span className="text-sm font-semibold antialiased block leading-tight">
                    {displayData?.user.fullName}
                  </span>
                  <span className="text-gray-600 text-xs block">
                    {displayData?.location}
                  </span>
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setTogglePostOptionModal(true)}
              >
                <BsThreeDots />
              </div>
            </div>
          </div>
          <div className="w-full h-[60%] px-4 pt-3 overflow-auto flex flex-col gap-5 no-scrollbar border-b">
            <div className="w-full flex items-center gap-3">
              <img
                draggable={false}
                className={`h-8 w-8 rounded-full`}
                src={`${displayData?.user.userInfo.avatar}`}
              />
              <p className="text-sm">
                <span className="font-semibold">
                  {displayData?.user.fullName}{" "}
                </span>
                {displayData?.content}
              </p>
            </div>
            {displayData?.comments.toReversed().map((val, index) => {
              if (val.type) {
                return (
                  <CommentText key={index} comment={val} post={displayData} />
                );
              }
            })}
          </div>
          <div className="w-full h-[30%] flex justify-between flex-col">
            <BehaviorIcon
              post={displayData}
              activeCommentKey={displayData?.id}
              isLike={isLike}
              setSave={setSave}
              setTogglePostOptionModal={setTogglePostOptionModal}
            />
            <div className="mx-4 mt-3">
              <p className="font-semibold text-sm">
                {formatPostNumber(displayData?.likeNumber)} likes
              </p>
              <p className="text-[0.7rem]">{displayData?.createdDate}</p>
            </div>
            <div className="px-4">
              <InputComment post={displayData} type={"PRIVATE"} />
            </div>
          </div>
        </div>
      </div>
      {tooglePostOptionModal && (
        <PostOptionModal
          setToggleModal={setTogglePostOptionModal}
          post={displayData}
          isSave={isSave}
          setSave={setSave}
        />
      )}
    </div>
  );
}
