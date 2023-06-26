import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useEffect } from "react";

import CommentText from "../commentComponent/CommentText";
import Slider from "../slider/Slider";
import { useParams } from "react-router-dom";
import { getPostById } from "../../thunk/PostThunk";
import { formatPostNumber } from "../../utils/util";

export default function EmbedPost() {
  const [listMeida, setListMedia] = useState([]);
  const [displayData, setDisplayData] = useState(null);
  const param = useParams();

  useEffect(() => {
    dispatch(getPostById(param.postId)).then((res) => {
      setDisplayData(res);
    });
  }, []);

  const dispatch = useDispatch();

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
      className={`z-50 w-[100vw] h-[100vh] flex justify-center items-center overflow-hidden duration-300 transition-al`}
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
              <div className="flex gap-1 py-10">
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
            <div className="mx-4 mt-3">
              <p className="font-semibold text-sm">
                {formatPostNumber(displayData?.likeNumber)} likes
              </p>
              <p className="text-[0.7rem]">{displayData?.createdDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
