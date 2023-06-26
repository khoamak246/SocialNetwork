import Cookies from "universal-cookie";
import {
  GET_LIST_ROOM_BY_USER_ID,
  POST_CREATER_NEW_ROOM,
  PUT_UPDATE_LAST_ACCESS,
} from "../api/service/RoomService";
import {
  setRoom,
  setSelectRoom,
  setSpecificRoom,
} from "../redux/reducers/RoomSlice";

export const getListRoomByUserId = () => {
  return async function getListRoomByUserIdThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      userId: getState().user.id,
    };
    let response = await GET_LIST_ROOM_BY_USER_ID(sendValue);
    if (response.status === 200) {
      dispatch(setRoom(response.data.data));
      dispatch(updateLastAccess(response.data.data[0].id));
      return true;
    } else {
      console.log(response);
      return false;
    }
  };
};

export const postCreateNewRoom = (sendValue) => {
  return async function postCreateNewRoomThunk(dispatch, getState) {
    let response = await POST_CREATER_NEW_ROOM(sendValue);
    if (response.status === 200) {
      dispatch(getListRoomByUserId());
      return true;
    } else {
      console.log(response);
      return false;
    }
  };
};

export const updateLastAccess = (userRoomId) => {
  return async function updateLastAccessThunk(dispatch, getState) {
    let sendValue = {
      token: new Cookies().get("token"),
      userRoomId,
    };
    let response = await PUT_UPDATE_LAST_ACCESS(sendValue);
    if (response.status === 200) {
      let roomTemp = [...getState().room.room];
      for (let i = 0; i < roomTemp.length; i++) {
        const element = roomTemp[i];
        if (element.id === response.data.data.id) {
          roomTemp[i] = response.data.data;
          break;
        }
      }

      dispatch(
        setSpecificRoom({ room: roomTemp, selectRoom: response.data.data })
      );
      return true;
    } else {
      console.log(response);
      return false;
    }
  };
};

export const updateWithSocket = (sendValue) => {
  return async function updateWithSocket(dispatch, getState) {
    let listRoomTemp = [...getState().room.room];
    if (getState().room.selectRoom.id == sendValue.id) {
      let indexSelectRoom = listRoomTemp.indexOf(getState().room.selectRoom);
      listRoomTemp[indexSelectRoom] = sendValue;
      let newState = {
        room: listRoomTemp,
        selectRoom: sendValue,
      };
      dispatch(setSpecificRoom(newState));
      dispatch(updateLastAccess(sendValue.id));
    } else {
      let indexIfHaveNewUserRoom = null;

      for (let i = 0; i < listRoomTemp.length; i++) {
        const element = listRoomTemp[i];
        if (element.id === sendValue.id) {
          indexIfHaveNewUserRoom = i;
          break;
        }
      }

      if (indexIfHaveNewUserRoom !== null) {
        listRoomTemp[indexIfHaveNewUserRoom] = sendValue;
        let newState = {
          room: listRoomTemp,
          selectRoom: getState().room.selectRoom,
        };
        dispatch(setSpecificRoom(newState));
      } else {
        let newListRoom = [sendValue, ...listRoomTemp];
        let newState = {
          room: newListRoom,
          selectRoom: getState().room.selectRoom,
        };
        dispatch(setSpecificRoom(newState));
      }
    }
  };
};
