import React from "react";
import { iconList } from "../../assets/js/icon/IconSelectConfig";
import { useState } from "react";
import { useEffect } from "react";
import { toggleSelector } from "../../redux/selectors/Selector";
import { useSelector } from "react-redux";

export default function IconSelect({ newPost, setNewPost }) {
  const [isChangeSize, setChangeSize] = useState(false);
  const toggleSelect = useSelector(toggleSelector);
  useEffect(() => {
    setTimeout(() => {
      setChangeSize(true);
    }, 100);
  }, []);
  return (
    <div
      className={`${isChangeSize ? "w-[70%] h-40 border-[2px]" : "w-0 h-0"} ${
        toggleSelect && toggleSelect === "createPost" ? "left-0" : "right-0"
      }  shadow-sm absolute bottom-[110%] rounded-lg flex flex-col justify-center items-center overflow-hidden duration-300 transition-all z-[50] bg-white`}
    >
      <div className="w-full flex justify-center items-center border-b bg-gradient-to-r from-yellow-500 to-pink-500">
        <p className="text-white font-semibold">Icon</p>
      </div>
      <div className="bg-white w-[90%] h-[90%] grid grid-cols-7 items-center">
        {iconList.map((val, index) => {
          return (
            <div className="group" key={index}>
              <p
                className="cursor-pointer hover:scale-110 duration-150 transition-all text-center group-hover:animate-bounce"
                onClick={() => {
                  setNewPost({
                    ...newPost,
                    content: newPost.content + val.icon,
                  });
                }}
              >
                {val.icon}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
