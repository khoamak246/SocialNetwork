import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUserSignInSelector } from "../../redux/selectors/Selector";

export default function StoryCircle({ post }) {
  const navigate = useNavigate();
  const currenUserSignIn = useSelector(currentUserSignInSelector);
  const [isSeen, setSeen] = useState(false);
  useEffect(() => {
    let { postBehavior } = post;
    for (let i = 0; i < postBehavior.length; i++) {
      const val = postBehavior[i];
      if (val.type === "story" && val.users.id === currenUserSignIn.id) {
        return setSeen(true);
      }
    }
  }, [post]);
  return (
    <div
      className="flex flex-col justify-between items-center gap-2 cursor-pointer"
      onClick={() => navigate(`/s/${post.id}`)}
    >
      <div
        className={`${
          !isSeen && "bg-gradient-to-r from-yellow-500 to-pink-500"
        } rounded-full overflow-hidden w-16 h-16 p-1`}
      >
        <div className="rounded-full overflow-hidden h-14 ring-[2px] ring-white">
          <img
            className="w-full h-full"
            src={post.user.userInfo.avatar}
            alt=""
          />
        </div>
      </div>
      <span className="text-xs">{post.user.fullName}</span>
    </div>
  );
}
