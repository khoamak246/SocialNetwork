import React from "react";
import { AiFillFileText } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { useSelector } from "react-redux";
import { selectRoomSelector } from "../../redux/selectors/Selector";

export default function ChatBubbleWithFile({ isContinue, isFollower }) {
  const selectRoom = useSelector(selectRoomSelector);
  return (
    <div className={`${!isFollower && "justify-end"} flex gap-4 w-full mt-3`}>
      {isFollower ? (
        <>
          <img
            draggable={false}
            className={`${isContinue && "opacity-0"} h-9 w-9 rounded-full`}
            src={`https://scontent.cdninstagram.com/v/t51.2885-19/352352343_219610037544014_1134582844166038257_n.jpg?stp=dst-jpg_s100x100&_nc_cat=101&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=WJqSMbp6QoUAX-pZjTR&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AfDHVCkHEEbMUTPNntD8q04tMyvoTiYH0GrACgHSK6dpTg&oe=64B4B5C6`}
          />
          <div className="max-w-[60%] bg-[#dfdfe1] overflow-hidden rounded-md p-2 cursor-pointer">
            <div className="bg-white flex h-16 rounded justify-between items-center gap-4 px-3">
              <div className="w-12 h-12 bg-[#E3E1FC] flex justify-center items-center rounded-md">
                <AiFillFileText className="w-6 h-6 fill-[#7269EF]" />
              </div>
              <div>
                <p className="font-semibold">admin_v1.0.zip</p>
                <p className="text-[0.8rem]">12.5 MB</p>
              </div>
              <div>
                <BsDownload />
                {/* <FcCheckmark /> */}
              </div>
            </div>
            <p
              className={`${
                isContinue && "hidden"
              } text-[0.8rem] text-[#5C6066] text-right`}
            >
              12:30
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="max-w-[60%] bg-[#E5EFFF] overflow-hidden rounded-md p-2 cursor-pointer">
            <div className="bg-white flex h-16 rounded justify-between items-center gap-4 px-3">
              <div className="w-12 h-12 bg-[#E3E1FC] flex justify-center items-center rounded-md">
                <AiFillFileText className="w-6 h-6 fill-[#7269EF]" />
              </div>
              <div>
                <p className="font-semibold">admin_v1.0.zip</p>
                <p className="text-[0.8rem]">12.5 MB</p>
              </div>
              <div>
                <BsDownload />
                {/* <FcCheckmark /> */}
              </div>
            </div>
            <p
              className={`${
                isContinue && "hidden"
              } text-[0.8rem] text-[#5C6066]`}
            >
              12:30
            </p>
          </div>
          <img
            draggable={false}
            className={`${
              isContinue &&
              selectRoom &&
              selectRoom.room.userNumber !== 1 &&
              "opacity-0"
            } h-9 w-9 rounded-full`}
            src={`https://scontent.cdninstagram.com/v/t51.2885-19/352352343_219610037544014_1134582844166038257_n.jpg?stp=dst-jpg_s100x100&_nc_cat=101&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=WJqSMbp6QoUAX-pZjTR&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.cdninstagram.com&oh=00_AfDHVCkHEEbMUTPNntD8q04tMyvoTiYH0GrACgHSK6dpTg&oe=64B4B5C6`}
          />
        </>
      )}
    </div>
  );
}
