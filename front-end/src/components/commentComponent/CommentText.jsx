import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { timeSince } from "../../utils/util";
import { HiOutlineMinus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserSignInSelector,
  toggleSelector,
} from "../../redux/selectors/Selector";
import { setNewNestedState } from "../../redux/reducers/CommentSlice";
import { createLikeComment, dislikeComment } from "../../thunk/CommentThunk";
import { useLocation } from "react-router-dom";

export default function CommentText({ comment, post }) {
  const [isExpandComment, setExpandComment] = useState(false);
  const [expandCommentCount, setExpandCommentCount] = useState(2);
  const currenUserSignIn = useSelector(currentUserSignInSelector);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleOnClickExpandComment = () => {
    if (!isExpandComment) {
      if (comment?.comments.length <= expandCommentCount + 1) {
        setExpandCommentCount(comment?.comments.length);
      }
      return setExpandComment(true);
    } else if (comment?.comments.length === expandCommentCount) {
      setExpandCommentCount(2);
      return setExpandComment(false);
    }

    if (comment?.comments.length - (expandCommentCount + 1) > 3) {
      setExpandCommentCount(expandCommentCount + 3);
    } else {
      setExpandCommentCount(comment?.comments.length);
    }
  };

  const checkLike = (cm) => {
    if (cm) {
      let { likeUser } = cm;
      if (likeUser.length == 0) {
        return false;
      } else {
        for (let i = 0; i < likeUser.length; i++) {
          const element = likeUser[i];
          if (element.id === currenUserSignIn.id) {
            return true;
          }
        }
        return false;
      }
    }
  };

  return (
    <div className="flex justify-between items-start w-full">
      <div className="flex flex-col w-[90%]">
        <div className="w-full flex items-center gap-3">
          <img
            draggable={false}
            className={`h-8 w-8 rounded-full`}
            src={`${comment?.user.userInfo.avatar}`}
          />
          <p className="text-sm">
            <span className="font-semibold">{comment?.user.fullName} </span>
            {comment?.content}
          </p>
        </div>
        <div className={`pl-11`}>
          <div className="grid grid-cols-4">
            <p className="text-[13px] text-[#939393] cursor-default">
              {timeSince(comment?.commentTime)}
            </p>
            {!location.pathname.includes("/embed") && (
              <>
                <p className="text-[13px] text-[#838383] font-semibold cursor-default">
                  {comment &&
                    `${
                      comment.likeNumber === 0
                        ? comment.likeNumber + " like"
                        : comment.likeNumber + " likes"
                    }`}
                </p>
                <p
                  className="text-[13px] text-[#838383] font-semibold cursor-pointer"
                  onClick={() => {
                    dispatch(
                      setNewNestedState({
                        nestedId: comment.id,
                        commentAuthName: comment.user.fullName,
                      })
                    );
                  }}
                >
                  Answer
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div
              className={`flex gap-2 items-center mt-2 ${
                comment && comment.comments.length === 0 && "hidden"
              }`}
            >
              <div>
                <HiOutlineMinus className="text-sm text-[#838383]" />
              </div>
              <p
                className={`text-[13px] text-[#838383] font-semibold cursor-pointer`}
                onClick={handleOnClickExpandComment}
              >
                {`${
                  comment?.comments.length === expandCommentCount &&
                  isExpandComment
                    ? "hidden"
                    : "see more"
                } (${
                  isExpandComment &&
                  comment?.comments.length > expandCommentCount
                    ? comment?.comments.length - (expandCommentCount + 1)
                    : comment?.comments.length === expandCommentCount &&
                      isExpandComment
                    ? "0"
                    : comment?.comments.length
                })`}
              </p>
            </div>
            <div
              className={`${
                isExpandComment
                  ? "max-h-[200px] overflow-auto no-scrollbar"
                  : "h-0 overflow-hidden"
              }  flex flex-col gap-3 duration-300 transition-all`}
            >
              {comment?.comments.toReversed().map((val, index) => {
                if (index <= expandCommentCount) {
                  return (
                    <div key={index}>
                      <div className="w-full flex items-center gap-3">
                        <img
                          draggable={false}
                          className={`h-4 w-4 rounded-full`}
                          src={`${val.user.userInfo.avatar}`}
                        />

                        <p className="text-sm">
                          <span className="font-semibold">
                            {val.user.fullName}{" "}
                          </span>
                          <span className="text-blue-600 font-semibold cursor-default">
                            {`${val?.content.split("</tagged>")[0]} `}
                          </span>
                          {val.content.split("</tagged>")[1]}
                        </p>
                      </div>
                      <div className="pl-6">
                        <div className="grid grid-cols-4 items-center">
                          <p className="text-[13px] text-[#939393] cursor-default">
                            {timeSince(val.commentTime)}
                          </p>
                          {!location.pathname.includes("/embed") && (
                            <>
                              <p className="text-[13px] text-[#838383] font-semibold cursor-default">
                                {comment &&
                                  `${
                                    val.likeNumber === 0
                                      ? val.likeNumber + " like"
                                      : val.likeNumber + " likes"
                                  }`}
                              </p>
                              <p
                                className="text-[13px] text-[#838383] font-semibold cursor-pointer"
                                onClick={() => {
                                  dispatch(
                                    setNewNestedState({
                                      nestedId: comment.id,
                                      commentAuthName: val.user.fullName,
                                    })
                                  );
                                }}
                              >
                                Answer
                              </p>
                            </>
                          )}

                          <div>
                            {checkLike(val) ? (
                              <AiFillHeart
                                className={`text-sm cursor-pointer fill-red-500`}
                                onClick={() => {
                                  dispatch(
                                    dislikeComment({ post, commentId: val.id })
                                  );
                                }}
                              />
                            ) : (
                              <AiOutlineHeart
                                className={`text-sm opacity-40 cursor-pointer`}
                                onClick={() => {
                                  dispatch(
                                    createLikeComment({
                                      post,
                                      commentId: val.id,
                                    })
                                  );
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-[10%] h-[100%] flex justify-end pt-1"></div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[10%] h-[100%] flex justify-center items-start pt-1">
        {checkLike(comment) ? (
          <AiFillHeart
            className={`text-sm cursor-pointer fill-red-500`}
            onClick={() => {
              dispatch(dislikeComment({ post, commentId: comment.id }));
            }}
          />
        ) : (
          <AiOutlineHeart
            className={`text-sm opacity-40 cursor-pointer`}
            onClick={() => {
              dispatch(createLikeComment({ post, commentId: comment.id }));
            }}
          />
        )}
      </div>
    </div>
  );
}
