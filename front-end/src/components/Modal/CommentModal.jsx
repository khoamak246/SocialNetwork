import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import BehaviorIcon from "../postComponent/BehaviorIcon";
import InputComment from "../commentComponent/InputComment";
import CommentText from "../commentComponent/CommentText";
import Slider from "../slider/Slider";
import { useDispatch } from "react-redux";
import { formatPostNumber } from "../../utils/util";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import { setResetCommentState } from "../../redux/reducers/CommentSlice";

export default function CommentModal({
  activeCommentKey,
  setTogglePostOptionModal,
  displayData,
  isLike,
  setCommentModalToggle,
}) {
  const [toggleModalLayout, setToggleModalLayout] = useState(false);
  const [toggleOContent, setToggleContent] = useState(false);
  const [listMeida, setListMedia] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setToggleModalLayout(true);
      setTimeout(() => {
        setToggleContent(true);
      }, 200);
    }, 100);
  }, []);

  const handleOnCloseModal = () => {
    dispatch(setResetCommentState());
    setTimeout(() => {
      setToggleContent(false);
      setTimeout(() => {
        setToggleModalLayout(false);
      }, 200);
    }, 100);
    setTimeout(() => {
      setCommentModalToggle(false);
    }, 500);
  };

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
  }, [displayData]);

  return (
    <div
      className={`z-50 fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center overflow-hidden duration-300 transition-all ${
        toggleModalLayout ? "scale-100 bg-black bg-opacity-60" : "scale-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleOnCloseModal}
      ></div>
      <div
        className={`absolute top-[3%] right-[3%] text-white text-2xl z-10 cursor-pointer`}
        onClick={handleOnCloseModal}
      >
        <AiOutlineClose />
      </div>
      <div
        className={`w-[70%] bg-white flex rounded ${
          toggleOContent ? "h-[90%]" : "h-0"
        } duration-300 transition-all overflow-hidden z-20`}
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
              activeCommentKey={activeCommentKey}
              isLike={isLike}
              post={displayData}
            />
            <div className="mx-4 mt-3">
              <p className="font-semibold text-sm">
                {formatPostNumber(displayData.likeNumber)} likes
              </p>
              <p className="text-[0.7rem]">{displayData.createdDate}</p>
            </div>
            <div className="px-4">
              <InputComment post={displayData} type={"PRIVATE"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
