import React, { useEffect, useState } from "react";

export default function ConfirmModal({ setToggleModal, nextAction }) {
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
      className={`z-[500] fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center overflow-hidden duration-300 transition-all ${
        toggleModalLayout ? "scale-100" : "scale-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleOnCloseModal}
      ></div>
      <div
        className={`w-[30%] bg-white flex flex-col rounded-xl ${
          toggleOContent ? "h-auto" : "h-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="flex justify-center items-center flex-col border-b h-28">
          <p className="text-xl">Drop posts?</p>
          <p className="text-sm text-[#7B7B7B] text-center">
            If you leave, you will lose what you just edited
          </p>
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
