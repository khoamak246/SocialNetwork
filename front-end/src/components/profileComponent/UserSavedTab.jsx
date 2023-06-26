import React from "react";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsCollectionFill } from "react-icons/bs";
import { IoChevronBackOutline } from "react-icons/io5";
import SavedPostSort from "./SavedPostSort";
import DeleteSavedConfirm from "../Modal/DeleteSavedConfirm";
import SavedOption from "../Modal/SavedOption";

export default function UserSavedTab({
  activeSavedTab,
  setActiveSavedTab,
  activeKey,
  collection,
  setSelectCollectionEdit,
  handleDeleteCollection,
}) {
  const [toogleModal, setToggleModal] = useState(false);
  const [toogleSaveOption, setSaveOption] = useState(false);

  const deletCollectionIMPL = async () => {
    let response = await handleDeleteCollection(collection.id);
    return response;
  };

  const handleSelectCollectionEdit = () => {
    setSelectCollectionEdit(collection);
    setActiveSavedTab("createCollection");
  };

  return (
    <>
      <div
        className={`${
          activeSavedTab === "" || activeSavedTab === activeKey
            ? "h-[15%] p-3 shadow-lg"
            : "h-0"
        } ${
          activeSavedTab === "" && "hover:bg-[#DBDBDB] hover:px-5"
        } w-full flex justify-center items-center bg-white cursor-pointer duration-100 transition-all group overflow-hidden`}
      >
        <div
          className={`${
            activeSavedTab === activeKey ? "w-0" : "w-full"
          }   flex justify-between items-center duration-200 transition-all`}
        >
          <div
            className={`flex items-center gap-3 overflow-hidden w-[95%]`}
            onClick={() => setActiveSavedTab(activeKey)}
          >
            <div>
              <BsCollectionFill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-md font-semibold">{collection.name}</p>

              <p className="text-sm">{collection.createDate}</p>
            </div>
          </div>
          <div
            className={`${
              activeSavedTab === activeKey && "w-0"
            } overflow-hidden w-[5%]`}
            onClick={() => setSaveOption(true)}
          >
            <BiDotsVerticalRounded />
          </div>
        </div>
        <div
          className={`${
            activeSavedTab === activeKey ? "w-full" : "w-0"
          } flex justify-between items-center overflow-hidden duration-100 transition-all`}
        >
          <div onClick={() => setActiveSavedTab("")}>
            <IoChevronBackOutline className="hover:scale-125 duration-200 transition-all hover:text-[#706c6c]" />
          </div>
          <div>{collection.name}</div>
          <div>
            <BiDotsVerticalRounded
              className="hover:scale-125 duration-200 transition-all hover:text-[#706c6c]"
              onClick={() => setSaveOption(true)}
            />
          </div>
        </div>
      </div>

      <div
        className={`${
          activeSavedTab === activeKey
            ? "h-[85%] overflow-auto no-scrollbar gap-2"
            : "h-0 overflow-hidden"
        } w-full flex flex-col items-center duration-200 transition-all`}
      >
        {collection.post.map((val, index) => {
          return (
            <SavedPostSort
              key={index}
              post={val}
              collection={collection}
            />
          );
        })}
      </div>

      {/* OPTION */}
      {toogleSaveOption && (
        <SavedOption
          type={"collection"}
          setToggleModal={setSaveOption}
          toggleEdit={handleSelectCollectionEdit}
          toggleDelete={setToggleModal}
        />
      )}

      {/* DELETE CONFIRM */}
      {toogleModal && (
        <DeleteSavedConfirm
          type={"collection"}
          setToggleModal={setToggleModal}
          nextAction={setToggleModal}
          deletCollectionIMPL={deletCollectionIMPL}
        />
      )}
    </>
  );
}
