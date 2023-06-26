import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  IoChatbubbleOutline,
  IoPaperPlaneOutline,
  IoBookmarkOutline,
  IoBookmark,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import {
  postCreateNewBehavior,
  postDeleteBehavior,
} from "../../thunk/PostThunk";
import { GET_COLLECTION_BY_USER_ID } from "../../api/service/CollectionService";
import { currentUserSignInSelector } from "../../redux/selectors/Selector";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function BehaviorIcon({
  isLike,
  post,
  activeCommentKey,
  setSave,
  setTogglePostOptionModal,
  setCommentModalToggle,
}) {
  const dispatch = useDispatch();
  const [isActiveBookmark, setActiveBookmark] = useState(false);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      let response = await GET_COLLECTION_BY_USER_ID({
        token: new Cookies().get("token"),
        value: currentUserSignIn.id,
      });
      if (response.status === 200) {
        let collection = response.data.data;
        collection.forEach((coll) => {
          coll.post.forEach((val) => {
            if (val?.id === post?.id) {
              return setActiveBookmark(true);
            }
          });
        });
      }
    }

    if (currentUserSignIn.id !== "") {
      fetchData();
    }
  }, [currentUserSignIn, post]);

  return (
    <div className="flex items-center justify-between mx-4 mt-3 mb-2">
      <div className="flex gap-5">
        <div className="cursor-pointer">
          {isLike ? (
            <AiFillHeart
              className="w-7 h-7 fill-red-500"
              onClick={() =>
                dispatch(postDeleteBehavior({ post, type: "like" }))
              }
            />
          ) : (
            <AiOutlineHeart
              className="w-7 h-7 hover:text-slate-500 duration-100 transition-all"
              onClick={() =>
                dispatch(postCreateNewBehavior({ post, type: "like" }))
              }
            />
          )}
        </div>
        <div
          className="cursor-pointer hover:text-slate-500 duration-100 transition-all"
          onClick={() => {
            if (activeCommentKey) {
              if (setCommentModalToggle) {
                setCommentModalToggle(`comment${activeCommentKey}`);
              }
              // dispatch(setOpenToggle(`comment${activeCommentKey}`));
            }
          }}
        >
          <IoChatbubbleOutline className="w-7 h-7" />
        </div>
        <div className="cursor-pointer hover:text-slate-500 duration-100 transition-all">
          <IoPaperPlaneOutline className="w-7 h-7" />
        </div>
      </div>
      <div className="flex cursor-pointer">
        {!isActiveBookmark ? (
          <IoBookmarkOutline
            className="w-7 h-7 hover:text-slate-500 duration-100 transition-all"
            onClick={() => {
              if (setSave && setTogglePostOptionModal) {
                setSave(true);
                setTogglePostOptionModal(true);
              }
            }}
          />
        ) : (
          <IoBookmark
            className="w-7 h-7"
            onClick={() => {
              dispatch(setOpenToggle(null));
              navigate(`/profile/${currentUserSignIn.id}/saved`);
            }}
          />
        )}
      </div>
    </div>
  );
}
