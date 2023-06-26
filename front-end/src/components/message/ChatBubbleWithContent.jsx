import React from "react";
import { useSelector } from "react-redux";
import { selectRoomSelector } from "../../redux/selectors/Selector";

export default function ChatBubbleWithContent({
  isContinue,
  isFollower,
  chat,
}) {
  const selectRoom = useSelector(selectRoomSelector);
  return (
    <div className={`${!isFollower && "justify-end"} flex gap-4 w-full mt-3`}>
      {isFollower ? (
        <>
          <img
            draggable={false}
            className={`${isContinue && "opacity-0"} h-9 w-9 rounded-full`}
            src={chat.user.userInfo.avatar}
          />
          <div className="max-w-[60%] bg-[#dfdfe1] overflow-hidden rounded-md p-2">
            <p className="w-full">{chat.content}</p>
            <p
              className={`${
                isContinue && "hidden"
              } text-[0.8rem] text-[#5C6066] text-right`}
            >
              {new Date(chat.createdTime).getHours()} :{" "}
              {new Date(chat.createdTime).getMinutes()}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="max-w-[60%] bg-[#E5EFFF] overflow-hidden rounded-md p-2">
            <p className="w-full">{chat.content}</p>
            <p
              className={`${
                isContinue &&
                selectRoom &&
                selectRoom.room.userNumber !== 1 &&
                "hidden"
              } text-[0.8rem] text-[#5C6066]`}
            >
              {new Date(chat.createdTime).getHours()} :{" "}
              {new Date(chat.createdTime).getMinutes()}
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
            src={chat.user.userInfo.avatar}
          />
        </>
      )}
    </div>
  );
}
