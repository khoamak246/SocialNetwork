import React, { useEffect, useState } from "react";

export default function CreateRoomChatModal({ setToggleModal, nextAction }) {
  const [toggleModalLayout, setToggleModalLayout] = useState(false);
  const [toggleOContent, setToggleContent] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setToggleModalLayout(true);
      setTimeout(() => {
        setToggleContent(true);
      }, 200);
    }, 100);
  }, []);

  const handleOnCloseModal = () => {
    setTimeout(() => {
      setToggleContent(false);
      setTimeout(() => {
        setToggleModalLayout(false);
      }, 200);
    }, 100);
    setTimeout(() => {
      setToggleModal(false);
    }, 500);
  };

  const handleDropCreated = () => {
    handleOnCloseModal();
    setTimeout(() => {
      nextAction();
    }, 200);
  };

  return (
    <div
      className={`z-[500] fixed top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-60 flex justify-center items-center overflow-hidden duration-300 transition-all ${
        toggleModalLayout ? "scale-100" : "scale-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleOnCloseModal}
      ></div>
      <div
        className={`w-[40%] bg-white flex flex-col rounded-xl ${
          toggleOContent ? "h-auto" : "h-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="flex justify-center items-center flex-col border-b h-28 gap-1">
          <p className="text-xl">Create chat room</p>
          <p className="text-sm text-[#7B7B7B] text-center">
            Exchange, share joy with friends in the same small group
          </p>
          <input
            id="roomName"
            type="text"
            placeholder="Enter room name..."
            className="outline-none border border-slate-400 rounded text-sm py-1 pl-2 w-[70%]"
          />
        </div>
        <div className="flex items-center flex-col border-b h-20 pt-2">
          <input
            id=""
            type="text"
            placeholder="Add friend..."
            className="outline-none border rounded text-sm py-1 pl-2 w-[70%] border-slate-400"
          />
        </div>
        <div
          className="w-full h-10 border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={handleDropCreated}
        >
          <p className="text-red-500 font-bold text-sm">Drop</p>
        </div>
        <div
          className="w-full h-10 border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={handleOnCloseModal}
        >
          <p className="text-sm">Cancel</p>
        </div>
      </div>
    </div>
  );
}
