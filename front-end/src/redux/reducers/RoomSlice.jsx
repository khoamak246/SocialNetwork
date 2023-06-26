import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  room: [],
  selectRoom: null,
};

export const RoomSlice = createSlice({
  initialState,
  name: "room",
  reducers: {
    setRoom: (state, action) => {
      let roomTemp = action.payload;
      let selectRoomTemp = null;
      if (roomTemp.length > 0) {
        selectRoomTemp = roomTemp[0];
      }
      return { room: roomTemp, selectRoom: selectRoomTemp };
    },
    setSpecificRoom: (state, action) => {
      return action.payload;
    },
    setSelectRoom: (state, action) => {
      return { ...state, selectRoom: action.payload };
    },
    setResetRoom: (state, action) => {
      return {
        room: [],
        selectRoom: null,
      };
    },
  },
});

export const { setRoom, setSpecificRoom, setSelectRoom, setResetRoom } =
  RoomSlice.actions;
export default RoomSlice.reducer;
