import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { formatPostContactNumber } from "../../utils/Util";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function UserPostCard({ postItem }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-60 h-60 relative cursor-pointer">
        {postItem.postImg[0].type ? (
          <>
            <img
              src={`${postItem.postImg[0].url}`}
              alt=""
              className="cursor-pointer w-full h-full"
            />
          </>
        ) : (
          <>
            <video
              src={`${postItem.postImg[0].url}`}
              alt=""
              className="cursor-pointer w-full h-full"
            />
          </>
        )}

        <div className="absolute top-0 left-0 flex justify-center bg-black bg-opacity-25 h-full w-full opacity-0 hover:opacity-100 duration-300 transition-all">
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center text-white gap-1">
              <AiFillHeart />
              <span>{formatPostContactNumber(postItem.likeNumber)}</span>
            </div>
            <div className="flex items-center text-white gap-1">
              <FaComment />
              <span>{formatPostContactNumber(postItem.commentNumber)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
