import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import CommentText from "../commentComponent/CommentText";
import InputComment from "../commentComponent/InputComment";
import BehaviorIcon from "./BehaviorIcon";
import CommentModal from "../Modal/CommentModal";
import PostOptionModal from "../Modal/PostOptionModal";
import Slider from "../slider/Slider";
import { useEffect } from "react";
import {
  currentUserSignInSelector,
  toggleSelector,
} from "../../redux/selectors/Selector";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { POST_SAVE_POST_TO_COLLECTION } from "../../api/service/CollectionService";
import { toast } from "react-hot-toast";
import { formatPostLikeNumber } from "../../utils/util";
import { useNavigate } from "react-router-dom";

export default function PostCard({ index, post }) {
  const toggleSelect = useSelector(toggleSelector);
  const [tooglePostOptionModal, setTogglePostOptionModal] = useState(false);
  const [isLike, setLike] = useState(false);
  const [isSave, setSave] = useState(false);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [listMeida, setListMedia] = useState([]);
  const [commentModalToggle, setCommentModalToggle] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (post) {
      let listImgTemp = [];
      post.postImg.forEach((val) => {
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
    if (post && post.postBehavior.length !== 0 && currentUserSignIn.id !== "") {
      post.postBehavior.forEach((val) => {
        setLike(val.type === "like" && val.users.id === currentUserSignIn.id);
      });
    } else {
      setLike(false);
    }
  }, [post, currentUserSignIn]);

  return (
    <div
      className={`bg-white border-b rounded-sm w-full max-w-[60%] ${
        index === 0 ? "border-y" : "border-b"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 w-full">
        <div
          className="flex gap-1 w-full cursor-pointer"
          onClick={() => navigate(`/profile/${post?.user.id}/post`)}
        >
          <img
            draggable={false}
            className="h-8 w-8 rounded-full"
            src={`${post?.user.userInfo.avatar}`}
          />
          <div className="ml-3 ">
            <span className="text-sm font-semibold antialiased block leading-tight">
              {post?.user.fullName}
            </span>
            <span className="text-gray-600 text-xs block">
              {post?.location}
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
      <Slider listMeida={listMeida} />
      <BehaviorIcon
        activeCommentKey={post?.id}
        setTogglePostOptionModal={setTogglePostOptionModal}
        isLike={isLike}
        post={post}
        setSave={setSave}
        setCommentModalToggle={setCommentModalToggle}
      />
      <div className="mx-4 flex flex-col gap-2">
        <p className="font-semibold text-sm">
          {" "}
          {formatPostLikeNumber(post?.likeNumber)} likes
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            <span className="font-semibold">{post?.user.fullName} </span>
            {post?.content}
          </p>
          <div
            className={`${post?.shareNumber == 0 && "hidden"} cursor-pointer`}
          >
            <p className="text-[#737385] text-sm">See more 26.153 comments</p>
          </div>
          <InputComment post={post} type={"ALL"} />
        </div>
      </div>
      {commentModalToggle === `comment${post?.id}` && (
        <CommentModal
          activeCommentKey={post?.id}
          setTogglePostOptionModal={setTogglePostOptionModal}
          isLike={isLike}
          displayData={post}
          setCommentModalToggle={setCommentModalToggle}
        />
      )}
      {tooglePostOptionModal && (
        <PostOptionModal
          setToggleModal={setTogglePostOptionModal}
          post={post}
          isSave={isSave}
          setSave={setSave}
        />
      )}
    </div>
  );
}
