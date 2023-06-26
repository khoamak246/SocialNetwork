import React from "react";
import { useSelector } from "react-redux";
import { selectRoomSelector } from "../../redux/selectors/Selector";

export default function ChatBubbleWaiting({ isFollower }) {
  const selectRoom = useSelector(selectRoomSelector);
  return (
    <div className={`${!isFollower && "justify-end"} flex gap-4 w-full mt-3`}>
      {isFollower ? (
        <>
          <div className="max-w-[30%] overflow-hidden rounded-md">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/loadingGif2.gif?alt=media&token=b65b5143-1259-4ebd-b37e-1a10c5a97813"
              alt=""
            />
          </div>
        </>
      ) : (
        <>
          <div className="max-w-[30%] overflow-hidden rounded-md">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/loadingGif2.gif?alt=media&token=b65b5143-1259-4ebd-b37e-1a10c5a97813"
              alt=""
            />
          </div>
        </>
      )}
    </div>
  );
}
