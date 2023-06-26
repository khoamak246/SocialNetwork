import React, { useEffect, useState } from "react";
import {
  AiFillCheckCircle,
  AiOutlinePlusCircle,
  AiOutlineTable,
  AiOutlineUser,
} from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";
import UserPostCard from "./UserPostCard";
import EmptyPost from "./EmptyPost";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserSignInSelector,
  profilePostSelector,
  profileSavedSelector,
} from "../../redux/selectors/Selector";
import { MdCancel, MdOutlineHistoryToggleOff } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserSavedTab from "./UserSavedTab";
import { GET_ALL_USER_POST_BY_USER_ID } from "../../api/service/PostService";
import { useCookies } from "react-cookie";
import { matchPath } from "react-router";
import { toast } from "react-hot-toast";
import {
  DELETE_COLLECTION,
  GET_COLLECTION_BY_USER_ID,
  POST_CREATE_NEW_COLLECTION,
  PUT_UPDATE_COLLECTION,
} from "../../api/service/CollectionService";
import { userFindByExpectedValue } from "../../thunk/UserThunk";
import {
  deleteCollection,
  getCollectionByUserId,
  getPostByUserId,
  postCreateNewCollection,
  putUpdateCollection,
} from "../../thunk/ProfilePageThunk";

export default function UserPostContainer() {
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();
  const [activeSavedTab, setActiveSavedTab] = useState("");
  const [cookie, setCookie] = useCookies();
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [inputCollectionName, setInputCollectionName] = useState("");
  const [selectCollectionEdit, setSelectCollectionEdit] = useState();
  const dispatch = useDispatch();
  const profilePost = useSelector(profilePostSelector);
  const profileSaved = useSelector(profileSavedSelector);

  const tabs = [
    {
      tab: "POST",
      icon: <AiOutlineTable />,
    },
    {
      tab: "STORY",
      icon: <MdOutlineHistoryToggleOff />,
    },
    {
      tab: "SAVED",
      icon: <BiBookmark />,
    },
  ];

  const resetall = () => {
    setInputCollectionName("");
    setSelectCollectionEdit();
    setActiveSavedTab("");
  };

  useEffect(() => {
    if (selectCollectionEdit) {
      setInputCollectionName(selectCollectionEdit.name);
    }
  }, [selectCollectionEdit]);

  useEffect(() => {
    let activeTab = "";
    if (location.pathname.includes("/post")) {
      activeTab = tabs[0].tab;
    } else if (location.pathname.includes("/story")) {
      activeTab = tabs[1].tab;
    } else if (location.pathname.includes("/saved")) {
      activeTab = tabs[2].tab;
    }
    setActiveTab(activeTab);
    resetall();
    let sendValue = {
      token: cookie.token,
      value: Number(param.userId),
    };
    if (
      location.pathname.includes("/post") ||
      location.pathname.includes("/story")
    ) {
      dispatch(getPostByUserId(sendValue));
    } else if (location.pathname.includes("/saved")) {
      if (param.userId != currentUserSignIn.id) {
        navigate("*");
      } else {
        dispatch(getCollectionByUserId(sendValue));
      }
    }
  }, [location.pathname]);

  const handleCreateNewCollection = async () => {
    let pattern = /^[a-zA-Z0-9\s()-_/]{8,35}$/;

    if (pattern.test(inputCollectionName)) {
      let sendValue = {
        token: cookie.token,
        value: {
          name: inputCollectionName,
          userId: currentUserSignIn.id,
        },
      };

      dispatch(postCreateNewCollection(sendValue))
        .then(() => {
          dispatch(
            getCollectionByUserId({
              token: cookie.token,
              value: Number(param.userId),
            })
          );
          dispatch(
            userFindByExpectedValue({
              value: cookie.username,
              token: cookie.token,
            })
          );
          toast.success("Create new collection successfully!", 2000);
          resetall();
        })
        .catch((error) => console.log(error));
    } else {
      toast.error(
        "OOP! Your password must be 8 - 35 character or contain invalid character",
        { duration: 4000 }
      );
    }
  };

  const handleEditCollection = async () => {
    let pattern = /^[a-zA-Z0-9\s()-_/]{8,35}$/;

    if (pattern.test(inputCollectionName)) {
      let sendValue = {
        token: cookie.token,
        value: {
          collectionId: selectCollectionEdit.id,
          value: {
            name: inputCollectionName,
          },
        },
      };

      dispatch(putUpdateCollection(sendValue))
        .then(() => {
          dispatch(
            getCollectionByUserId({
              token: cookie.token,
              value: Number(param.userId),
            })
          );
          dispatch(
            userFindByExpectedValue({
              value: cookie.username,
              token: cookie.token,
            })
          );
          toast.success("Edit successfully!", { duration: 2000 });
          resetall();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.error(
        "OOP! Your password must be 8 - 35 character or contain invalid character",
        { duration: 4000 }
      );
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    let sendValue = {
      token: cookie.token,
      value: collectionId,
    };

    dispatch(deleteCollection(sendValue))
      .then(() => {
        dispatch(
          getCollectionByUserId({
            token: cookie.token,
            value: Number(param.userId),
          })
        );
        dispatch(
          userFindByExpectedValue({
            value: cookie.username,
            token: cookie.token,
          })
        );
        resetall();
        toast.success("Delete successfully!", { duration: 2000 });
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  return (
    <div className="border-t w-100 flex flex-col items-center justify-center">
      <div className="flex space-x-24 relative">
        {tabs.map((item, index) => (
          <div
            key={index}
            className={`${
              item.tab === "SAVED" &&
              param.userId != currentUserSignIn.id &&
              "hidden"
            } flex items-center cursor-pointer py-2 text-sm gap-1 ${
              activeTab === item.tab ? "border-t border-black" : "opacity-60"
            } transition-all duration-200`}
            onClick={() => {
              setActiveTab(item.tab);
              navigate(`/profile/${param.userId}/${item.tab.toLowerCase()}`);
            }}
          >
            <p>{item.icon}</p>
            <p className="text-md">{item.tab}</p>
          </div>
        ))}
      </div>

      {/* POST STORY */}
      <div
        className={`${
          activeTab !== "POST" && activeTab !== "STORY" && "hidden"
        }`}
      >
        {profilePost && Array.isArray(profilePost) ? (
          <>
            <div className={`flex flex-wrap items-center justify-center gap-4`}>
              {profilePost.toReversed().map((item, index) => {
                if (currentUserSignIn.id !== param.userId && !item.privacy) {
                  return true;
                }
                if (location.pathname.includes("/post") && item.type) {
                  return (
                    <div
                      onClick={() => navigate(`/postDetail/${item.id}`)}
                      key={index}
                    >
                      <UserPostCard postItem={item} />
                    </div>
                  );
                } else if (location.pathname.includes("/story") && !item.type) {
                  return (
                    <div onClick={() => navigate(`/s/${item.id}`)} key={index}>
                      <UserPostCard postItem={item} />
                    </div>
                  );
                }
              })}
            </div>
          </>
        ) : (
          <>
            <EmptyPost tab={activeTab} />
          </>
        )}
      </div>

      {/* SAVED */}
      <div
        className={`${
          (activeTab === "POST" || activeTab === "STORY") && "hidden"
        } flex w-[80%] h-[350px] relative`}
      >
        <div className="w-[95%] h-full flex justify-center border rounded-lg overflow-hidden">
          <div
            className={`${
              activeSavedTab === "" && "gap-2"
            } w-full h-full flex flex-col overflow-auto no-scrollbar`}
          >
            {profileSaved &&
              Array.isArray(profileSaved) &&
              profileSaved.map((val, index) => {
                return (
                  <UserSavedTab
                    key={index}
                    activeKey={index}
                    activeSavedTab={activeSavedTab}
                    setActiveSavedTab={setActiveSavedTab}
                    collection={val}
                    setSelectCollectionEdit={setSelectCollectionEdit}
                    handleDeleteCollection={handleDeleteCollection}
                  />
                );
              })}
          </div>
        </div>
        <div
          className="w-[5%] flex justify-center"
          onClick={() => {
            if (activeSavedTab !== "createCollection") {
              setActiveSavedTab("createCollection");
            } else {
              setActiveSavedTab("");
            }
          }}
        >
          <AiOutlinePlusCircle className="text-lg cursor-pointer hover:scale-110 duration-300 transition-all" />
        </div>

        {/* ? CRETATE COLLECTION MODAL */}
        <div
          className={`${
            activeSavedTab === "createCollection" ? "h-[20%] px-8" : "h-0"
          } absolute top-0 left-0 w-[95%] bg-[#d8d3d3] rounded-lg flex justify-center items-center  overflow-hidden duration-200 transition-all`}
        >
          <div className="flex justify-between w-full items-center">
            <p className="text-sm font-semibold">Create new collection |</p>
            <div className="w-[40%] bg-white p-1 rounded-md">
              <input
                value={inputCollectionName}
                type="text"
                placeholder="Input collection name..."
                className="outline-none w-full text-sm"
                onChange={(e) => setInputCollectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (selectCollectionEdit) {
                      handleEditCollection();
                    } else {
                      handleCreateNewCollection();
                    }
                  }
                }}
              />
            </div>
            <div className="flex w-[15%] gap-2">
              <div
                className="flex justify-center items-center gap-1 hover:scale-105 duration-200 transition-all cursor-pointer"
                onClick={() => handleCreateNewCollection()}
              >
                <p className="text-sm font-semibold">Save</p>
                <div>
                  <AiFillCheckCircle className="fill-green-500" />
                </div>
              </div>
              <div
                className="flex justify-center items-center gap-1 hover:scale-105 duration-200 transition-all cursor-pointer"
                onClick={() => {
                  if (selectCollectionEdit) {
                    handleEditCollection();
                  } else {
                    handleCreateNewCollection();
                  }
                }}
              >
                <p className="text-sm font-semibold">Cancel</p>
                <div>
                  <MdCancel className="fill-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
