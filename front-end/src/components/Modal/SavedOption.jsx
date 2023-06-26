import React, { useEffect, useState } from "react";

export default function SavedOption({
  setToggleModal,
  toggleEdit,
  toggleDelete,
  type,
}) {
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

  //   TODO: Change next action to axios call
  const handleDropCreated = (action) => {
    if (action === "edit") {
      toggleEdit();
    } else if (action === "delete") {
      toggleDelete(true);
    }
    setTimeout(() => {
      handleOnCloseModal();
    }, 200);
  };

  return (
    <div
      className={` z-[500] fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center overflow-hidden duration-300 transition-all ${
        toggleModalLayout ? "scale-100" : "scale-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleOnCloseModal}
      ></div>
      <div
        className={`w-[30%] bg-white flex flex-col rounded-xl ${
          toggleOContent ? "h-auto border shadow-lg" : "h-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div
          className={`${
            type === "post" && "hidden"
          } w-full h-10 border-b flex justify-center items-center cursor-pointer hover:bg-slate-100`}
          onClick={() => handleDropCreated("edit")}
        >
          <p className="text-red-500 font-bold text-sm">Edit</p>
        </div>
        <div
          className="w-full h-10 border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={() => handleDropCreated("delete")}
        >
          <p className="text-red-500 font-bold text-sm">Delete</p>
        </div>
        <div
          className="w-full h-10 border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={() => handleOnCloseModal("cancel")}
        >
          <p className="text-sm">Cancel</p>
        </div>
      </div>
    </div>
  );
}
