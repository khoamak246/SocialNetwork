import React, { useState } from "react";
import { HiOutlineSelector } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import DeleteSavedConfirm from "../Modal/DeleteSavedConfirm";

export default function SavedPostSort({ post, collection }) {
  const [toogleModal, setToggleModal] = useState(false);
  return (
    <div className="w-[95%] h-[15%] rounded-md px-2 flex flex-col justify-center cursor-pointer shadow-md border hover:px-4 duration-200 transition-all">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <HiOutlineSelector />
          <p className="text-sm text-blue-600 font-semibold">
            {`@${post.user.fullName}`}{" "}
          </p>
          <p className="text-sm max-w-xs text-ellipsis overflow-hidden whitespace-nowrap">
            {post.content}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          <p className="text-sm">{post.createdDate}</p>
          <div onClick={() => setToggleModal(true)}>
            <MdDelete className="hover:fill-[#706c6c] hover:scale-110 duration-100 transition-all" />
          </div>
        </div>
      </div>
      {toogleModal && (
        <DeleteSavedConfirm
          post={post}
          collection={collection}
          type={"post"}
          setToggleModal={setToggleModal}
        />
      )}
    </div>
  );
}
