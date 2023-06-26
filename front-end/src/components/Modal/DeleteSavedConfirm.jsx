import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostInCollection,
  getCollectionByUserId,
} from "../../thunk/ProfilePageThunk";
import Cookies from "universal-cookie";
import { currentUserSignInSelector } from "../../redux/selectors/Selector";

export default function DeleteSavedConfirm({
  setToggleModal,
  type,
  deletCollectionIMPL,
  collection,
  post,
}) {
  const [toggleModalLayout, setToggleModalLayout] = useState(false);
  const [toggleOContent, setToggleContent] = useState(false);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const dispatch = useDispatch();

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

  const handleConfirmDelete = async () => {
    let response;
    if (type === "collection") {
      response = await deletCollectionIMPL();
    } else {
      dispatch(
        deletePostInCollection({ collectionId: collection.id, postId: post.id })
      ).then((res) => {
        if (res) {
          dispatch(
            getCollectionByUserId({
              token: new Cookies().get("token"),
              value: currentUserSignIn.id,
            })
          );
        }
      });
    }

    handleOnCloseModal();
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
          toggleOContent ? "h-auto border shadow-lg" : "h-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="flex justify-center items-center flex-col border-b h-28">
          <p className="text-xl">{`Delete ${type}?`}</p>
          <p className="text-sm text-[#7B7B7B] text-center">
            {`Are you sure you want to delete this ${type}?`}
          </p>
        </div>
        <div
          className="w-full h-10 border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={handleConfirmDelete}
        >
          <p className="text-red-500 font-bold text-sm">Delete</p>
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
