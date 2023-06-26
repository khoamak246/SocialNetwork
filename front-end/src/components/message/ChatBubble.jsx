import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserSignInSelector,
  roomSelector,
  selectRoomSelector,
} from "../../redux/selectors/Selector";
import { useCookies } from "react-cookie";
import {
  getListRoomByUserId,
  postCreateNewRoom,
  updateLastAccess,
} from "../../thunk/RoomThunk";
import { setSelectRoom } from "../../redux/reducers/RoomSlice";

export default function ChatBubble({
  user,
  type,
  room,
  resetSearchInput,
  userRoom,
}) {
  const listRoom = useSelector(roomSelector);
  const currentSignInUser = useSelector(currentUserSignInSelector);
  const [cookie, setCookie] = useCookies();
  const dispatch = useDispatch();
  const selectRoom = useSelector(selectRoomSelector);
  console.log(room);

  const countNotReadMessage = () => {
    let currentUserLastAccessChanel =
      room?.userRoom[0].user.id === currentSignInUser.id
        ? room.userRoom[0].latsAccess
        : room.userRoom[1].latsAccess;
    let { chat } = room;
    let count = 0;
    if (chat.length === 0) {
      return 0;
    } else {
      for (let i = 0; i < chat.length; i++) {
        const element = chat[i];
        if (element.createdTime > currentUserLastAccessChanel) {
          count++;
        }
      }
      return count;
    }
  };

  const onSeclectDisplayRoom = async () => {
    if (type !== "search") {
      dispatch(updateLastAccess(userRoom.id));
    } else if (type === "search") {
      if (isUserExistInPrivateRoom()) {
        dispatch(updateLastAccess(isUserExistInPrivateRoom()));
        resetSearchInput();
      } else {
        let sendValue = {
          token: cookie.token,
          value: {
            creatorUser: currentSignInUser.id,
            userList: [currentSignInUser.id, user.id],
          },
        };
        dispatch(postCreateNewRoom(sendValue));
        resetSearchInput();
      }
    }
  };

  const isUserExistInPrivateRoom = () => {
    if (user.id === currentSignInUser.id) {
      for (let i = 0; i < listRoom.length; i++) {
        const val = listRoom[i];
        let { room } = val;
        if (room.userNumber === 1) {
          return val.id;
        }
      }
    }

    for (let i = 0; i < listRoom.length; i++) {
      const val = listRoom[i];
      let { room } = val;
      if (room.userNumber < 3) {
        let { userRoom } = room;
        for (let i = 0; i < userRoom.length; i++) {
          const userInRoom = userRoom[i];
          if (userInRoom.user.id === user.id) {
            return val.id;
          }
        }
      }
    }
    return null;
  };

  return (
    <div
      className={`${
        selectRoom && room && selectRoom.room.id === room.id
          ? "bg-[#d6e1f8]"
          : "hover:bg-[#E6EBF5]"
      } w-full h-[56px] py-[40px] px-6 flex justify-between items-center cursor-pointer transition-all duration-300 `}
      onClick={onSeclectDisplayRoom}
    >
      <div className="flex gap-4 w-full items-center">
        <img
          draggable={false}
          className="h-14 w-14 rounded-full"
          src={user.userInfo.avatar}
        />
        <div>
          <span className="text-sm font-semibold antialiased block leading-tight">
            {user.fullName}
          </span>
          <span
            className={`${
              type === "search" && "hidden"
            } text-gray-600 text-xs block`}
          >
            Hello this is message
          </span>
        </div>
      </div>
      <div
        className={`${type === "search" && "hidden"} ${
          countNotReadMessage() === 0 && "hidden"
        }  rounded-full w-5 h-5 bg-red-600 flex items-center justify-center`}
      >
        <p className={`text-[0.8rem] text-white font-semibold`}>
          {countNotReadMessage()}
        </p>
      </div>
    </div>
  );
}
