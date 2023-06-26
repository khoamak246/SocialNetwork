import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { authSignIn } from "../../thunk/AuthThunk";
import {
  findUserByRelativeValue,
  userFindByExpectedValue,
} from "../../thunk/UserThunk";
import {
  authAuthenticationState,
  currentUserSignInSelector,
  roomSelector,
  selectRoomSelector,
} from "../../redux/selectors/Selector";
import EmpyMessage from "./EmpyMessage";
import ChatBubble from "./ChatBubble";
import { BiDotsHorizontalRounded, BiImage } from "react-icons/bi";
import {
  AiOutlinePhone,
  AiOutlineSearch,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import { CiFaceSmile } from "react-icons/ci";
import { IoMdAttach } from "react-icons/io";
import { RiSendPlane2Fill, RiSendPlane2Line } from "react-icons/ri";
import ChatBubbleWithContent from "./ChatBubbleWithContent";
import ChatBubbleWithImg from "./ChatBubbleWithImg";
import ChatBubbleWithFile from "./ChatBubbleWithFile";
import CreateRoomChatModal from "../Modal/CreateRoomChatModal";
import { iconList } from "../../assets/js/icon/IconSelectConfig";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { getListRoomByUserId, updateWithSocket } from "../../thunk/RoomThunk";
import { setSpecificRoom } from "../../redux/reducers/RoomSlice";
import { useNavigate } from "react-router-dom";
import { MdCancel, MdOutlineCancel } from "react-icons/md";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/Firebase";
import ChatBubbleWaiting from "./ChatBubbleWaiting";

let stompClient = null;
export default function Message() {
  const [cookie, setCookie] = useCookies();
  const dispatch = useDispatch();
  const authenticationState = useSelector(authAuthenticationState);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [isIconSelect, setIconSelect] = useState(false);
  const [inputChat, setInputChat] = useState("");
  const listRoom = useSelector(roomSelector);
  const [searchingUser, setSearchingUser] = useState({
    searchValue: "",
    searchResult: [],
    isSearching: false,
  });
  const selectRoom = useSelector(selectRoomSelector);
  const testSlect = useSelector((state) => state);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewListFile, setPreviewListFile] = useState([]);
  const [upFirebaseList, setUpFirebaseList] = useState([]);
  const [toggleWaiting, setToggleWaiting] = useState(false);

  const resetSearchInput = () => {
    setSearchingUser({
      searchValue: "",
      searchResult: [],
      isSearching: false,
    });
  };

  const handleOnChaneSearchInput = (e) => {
    let { value } = e.target;
    if (value.length !== 0) {
      setSearchingUser({
        ...searchingUser,
        searchValue: value,
        isSearching: true,
      });
    } else {
      setSearchingUser({
        searchValue: "",
        searchResult: [],
        isSearching: false,
      });
    }
  };

  useEffect(() => {
    let timeOutId = 0;
    if (searchingUser.searchValue !== "") {
      timeOutId = setTimeout(() => {
        dispatch(findUserByRelativeValue(searchingUser.searchValue)).then(
          (res) => {
            if (res !== null) {
              setSearchingUser({
                ...searchingUser,
                searchResult: res,
                isSearching: false,
              });
            } else {
              setSearchingUser({
                ...searchingUser,
                searchResult: [],
                isSearching: false,
              });
            }
            console.log(res);
          }
        );
      }, 300);
    }

    return () => clearTimeout(timeOutId);
  }, [searchingUser.searchValue]);

  useEffect(() => {
    if (currentUserSignIn.id !== "") {
      dispatch(getListRoomByUserId());
      connect();
    }
  }, [currentUserSignIn]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onError = (error) => {
    console.log(error);
  };

  const onConnected = () => {
    stompClient.subscribe(
      "/user/" + currentUserSignIn.username + "/private",
      onPrivateMessageReceived
    );
  };

  const handleSelectUser = () => {
    if (selectRoom) {
      if (selectRoom.room.userNumber === 1) {
        return selectRoom.room.userRoom[0].user;
      } else if (selectRoom.room.userNumber === 2) {
        if (selectRoom.room.userRoom[0].user.id === currentUserSignIn.id) {
          return selectRoom.room.userRoom[1].user;
        } else {
          return selectRoom.room.userRoom[0].user;
        }
      } else {
        return "";
      }
    }
  };

  const onPrivateMessageReceived = (payload) => {
    let newUserRoom = JSON.parse(payload.body);
    dispatch(updateWithSocket(newUserRoom));
  };

  const handleRenderChatSelectResult = () => {
    let { searchValue, searchResult, isSearching } = searchingUser;
    if (searchValue !== "" && isSearching) {
      return (
        <img
          className="w-24 h-24"
          src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/load-1110_256.gif?alt=media&token=56a65fa0-8518-43c2-82b0-245c912f8990"
          alt=""
        />
      );
    } else if (searchValue !== "" && !isSearching) {
      if (searchResult.length === 0) {
        return (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/noresult2.png?alt=media&token=1978c2f2-982c-4448-aca8-6c843e8e34b7"
            alt=""
          />
        );
      } else {
        return searchResult.map((val, index) => (
          <ChatBubble
            user={val}
            key={index}
            type={"search"}
            resetSearchInput={resetSearchInput}
          />
        ));
      }
    } else {
      if (listRoom.length !== 0) {
        return listRoom.map((val, index) => {
          if (val.room.userNumber === 1) {
            return (
              <ChatBubble
                user={val.room.userRoom[0].user}
                key={index}
                room={val.room}
                resetSearchInput={resetSearchInput}
                userRoom={val}
              />
            );
          } else if (val.room.userNumber === 2) {
            return (
              <ChatBubble
                user={
                  val.room.userRoom[0].user.id === currentUserSignIn.id
                    ? val.room.userRoom[1].user
                    : val.room.userRoom[0].user
                }
                key={index}
                room={val.room}
                resetSearchInput={resetSearchInput}
                userRoom={val}
              />
            );
          }
          // TODO: ADD GROUP CHAT RENDER
        });
      } else {
        return <p className="text-sm">Message not found</p>;
      }
    }
  };

  const onChangeInputFile = (e) => {
    handleRevokePreviewMedia(previewListFile);
    let listFile = e.target.files;
    let isUploadFileValid = isListFileValid(listFile);
    if (isUploadFileValid) {
      let previewArr = [];
      let firebaseUpload = [];
      for (let i = 0; i < listFile.length; i++) {
        let preview = {
          url: URL.createObjectURL(listFile[i]),
          type: listFile[i].type.includes("image") ? "img" : "video",
        };
        previewArr.push(preview);
        firebaseUpload.push(listFile[i]);
      }
      setPreviewListFile([...previewArr]);
      setUpFirebaseList([...firebaseUpload]);
    }
  };

  const isListFileValid = (listFile) => {
    if (!listFile || listFile.length <= 0) {
      return false;
    }
    for (let i = 0; i < listFile.length; i++) {
      if (!listFile[i].type.startsWith("image")) {
        if (!listFile[i].type.startsWith("video")) {
          return false;
        }
      }
    }
    return true;
  };

  const handleRevokePreviewMedia = (listMedia) => {
    if (listMedia.length !== 0) {
      listMedia.forEach((val) => {
        URL.revokeObjectURL(val.url);
      });
    }
  };

  const handleUploadToFirebase = async (content) => {
    setToggleWaiting(true);
    upFirebaseList.forEach((val, index) => {
      const imageRef = ref(storage, `image/${val.name + v4()}`);
      uploadBytes(imageRef, val).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          let receiverUser = handleSelectUser().username;
          let chatMessage = {
            senderName: currentUserSignIn.username,
            receiverName: receiverUser,
            content: url,
            chatContentType: val.type.includes("image") ? "IMG" : "VIDEO",
            roomId: selectRoom.room.id,
            chatMessageStatus: "MESSAGE",
          };
          stompClient.send(
            "/app/private-message",
            {},
            JSON.stringify(chatMessage)
          );
          if (index === upFirebaseList.length - 1 && inputChat.length !== 0) {
            setTimeout(() => {
              onSendMessage(content);
              setToggleWaiting(false);
            }, [300]);
          }
        });
      });
    });
    handleRevokePreviewMedia(previewListFile);
    setPreviewListFile([]);
    setUpFirebaseList([]);
  };

  const onSendMessage = (content) => {
    if (content.trim().length !== 0) {
      let receiverUser = handleSelectUser().username;
      let chatMessage = {
        senderName: currentUserSignIn.username,
        receiverName: receiverUser,
        content,
        chatContentType: "TEXT",
        roomId: selectRoom.room.id,
        chatMessageStatus: "MESSAGE",
      };
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
    }
    setInputChat("");
  };

  useEffect(() => {
    let element = document.getElementById("chatContainer");
    if (element !== null) {
      element.scrollTop = element.scrollHeight;
    }
  }, [selectRoom, toggleWaiting]);

  return (
    <div className="w-full h-[100vh] flex">
      <div className="w-1/3 h-full flex flex-col border-r shadow-2xl overflow-hidden bg-[#F5F7FB]">
        <div className="h-1/6 w-full flex flex-col justify-between items-center px-6 py-6 border-b backdrop-filter backdrop-blur bg-opacity-50 opacity-100 shadow-sm shadow-slate-100 transition-all duration-300 gap-3">
          <div className="flex w-full justify-between">
            <div className="text-xl font-bold">
              {currentUserSignIn.fullName}
            </div>
            <div className="cursor-pointer">
              <svg
                aria-label="Tin nhắn mới"
                className="x1lliihq x1n2onr6"
                color="rgb(0, 0, 0)"
                fill="rgb(0, 0, 0)"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Tin nhắn mới</title>
                <path
                  d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokewidthstroke-width="2"
                ></path>
                <path
                  d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  x1="16.848"
                  x2="20.076"
                  y1="3.924"
                  y2="7.153"
                ></line>
              </svg>
            </div>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchingUser.searchValue}
              className="bg-[#E6EBF5] w-[95%] py-2 pl-4 rounded-md outline-none text-sm"
              onChange={handleOnChaneSearchInput}
            />
          </div>
        </div>
        <div className="w-full flex flex-col h-5/6 overflow-auto no-scrollbar">
          <div className="h-[5%] flex items-center justify-between px-6">
            <p className="font-bold">Message</p>
            <p className="text-[#737373] cursor-pointer text-sm">
              Waiting message
            </p>
          </div>

          <div
            className={`${
              listRoom.length === 0 &&
              searchingUser.searchResult.length === 0 &&
              "justify-center items-center"
            } w-full h-[95%] flex flex-col`}
          >
            {handleRenderChatSelectResult()}
          </div>
        </div>
      </div>
      <div
        className={`${
          selectRoom ? "justify-between" : "justify-center"
        } w-2/3 h-full flex flex-col items-center bg-white`}
      >
        {selectRoom ? (
          <>
            {/* NAV */}
            <div
              className={`h-[13%] w-full border-b flex justify-between items-center px-6`}
            >
              <div className={`${!selectRoom && "hidden"}`}>
                <div className="flex gap-4 w-full items-center">
                  <img
                    draggable={false}
                    className="h-10 w-10 rounded-full"
                    src={`${
                      selectRoom ? handleSelectUser().userInfo.avatar : ""
                    }`}
                  />
                  <div>
                    <span className="text-md font-semibold antialiased block leading-tight">
                      {handleSelectUser().fullName}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`flex gap-4`}>
                <AiOutlineSearch className="w-6 h-6 text-[#7A7F9A] cursor-pointer" />
                <AiOutlinePhone className="w-6 h-6 text-[#7A7F9A] cursor-pointer" />
                <AiOutlineVideoCamera className="w-6 h-6 text-[#7A7F9A] cursor-pointer" />
                <BiDotsHorizontalRounded className="w-6 h-6 text-[#7A7F9A] cursor-pointer" />
              </div>
            </div>
            {/* BODY */}
            <div
              className={`h-[74%] w-full px-6 overflow-auto no-scrollbar pb-2`}
            >
              <div
                id="chatContainer"
                className="flex flex-col w-full h-full overflow-auto no-scrollbar"
              >
                {selectRoom.room.chat.map((val, index) => {
                  if (val.chatType.name === "TEXT") {
                    return (
                      <ChatBubbleWithContent
                        isFollower={currentUserSignIn.id !== val.user.id}
                        isContinue={
                          index > 0 &&
                          val.user.id ===
                            selectRoom.room.chat[index - 1].user.id
                        }
                        chat={val}
                        key={val.id}
                      />
                    );
                  } else if (
                    val.chatType.name === "IMG" ||
                    val.chatType.name === "VIDEO"
                  ) {
                    return (
                      <ChatBubbleWithImg
                        isFollower={currentUserSignIn.id !== val.user.id}
                        isContinue={
                          index > 0 &&
                          val.user.id ===
                            selectRoom.room.chat[index - 1].user.id
                        }
                        chat={val}
                        key={val.id}
                      />
                    );
                  } else {
                    return (
                      <ChatBubbleWithFile
                        isFollower={currentUserSignIn.id !== val.user.id}
                        isContinue={
                          index > 0 &&
                          val.user.id ===
                            selectRoom.room.chat[index - 1].user.id
                        }
                        chat={val}
                        key={val.id}
                      />
                    );
                  }
                })}
                {toggleWaiting && (
                  <ChatBubbleWaiting
                    isFollower={handleSelectUser().id === currentUserSignIn.id}
                  />
                )}
                {/*
                <ChatBubbleWithFile isFollower={false} />
                <ChatBubbleWithFile isFollower={true} /> */}
              </div>
            </div>
            {/* FOOTER */}
            <div className={`h-[13%] w-full border-t flex bg-white relative`}>
              <input
                type="file"
                className="absolute top-0 left-0 z-[-1]"
                ref={fileInputRef}
                accept="image/*, video/*"
                multiple={true}
                onChange={onChangeInputFile}
              />
              {previewListFile.length != 0 && (
                <div className="absolute bottom-[76%] left-[14px] w-[534px] h-[100px] bg-[#E6EBF5] flex justify-center items-center rounded-t-md">
                  <div
                    className="w-[95%] h-[89%] flex gap-2 overflow-auto custom-scrollbar p-1"
                    draggable={false}
                  >
                    {previewListFile.map((val, index) => {
                      return (
                        <div className="h-full relative" key={index}>
                          <div
                            className="top-0 right-0 absolute cursor-pointer"
                            onClick={() => {
                              URL.revokeObjectURL(val);
                              let newPreviewArr = [...previewListFile];
                              newPreviewArr.splice(index, 1);
                              setPreviewListFile(newPreviewArr);
                              let newUploadFirebaseArr = [...upFirebaseList];
                              newUploadFirebaseArr = upFirebaseList.splice(
                                index,
                                1
                              );
                              setUpFirebaseList(newUploadFirebaseArr);
                            }}
                          >
                            <MdCancel />
                          </div>
                          <img
                            src={
                              val.type === "img"
                                ? val.url
                                : "https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/video_icon.png?alt=media&token=f0a5276c-4c63-40b0-87d4-6978e6245809"
                            }
                            alt=""
                            draggable={false}
                            className="h-full max-w-lg rounded-xl"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="w-[70%] h-full flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Enter message..."
                  value={inputChat}
                  className={`${
                    previewListFile.length !== 0 ? "rounded-b-md" : "rounded-md"
                  } bg-[#E6EBF5] w-[95%] py-3 pl-4 outline-none text-sm`}
                  onChange={(e) => setInputChat(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (upFirebaseList.length !== 0) {
                        handleUploadToFirebase(inputChat);
                      } else {
                        onSendMessage(inputChat);
                      }
                      setInputChat("");
                    }
                  }}
                />
              </div>
              <div className="w-[30%] h-full flex justify-between items-center px-5">
                <CiFaceSmile
                  className="w-4 h-4 stroke-[0.5] cursor-pointer text-[#7269EF]"
                  onClick={() => setIconSelect(!isIconSelect)}
                />
                <IoMdAttach className="w-4 h-4 stroke-1 cursor-pointer text-[#7269EF]" />
                <BiImage
                  className="w-4 h-4 stroke-[0.5] cursor-pointer text-[#7269EF]"
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                />
                <div
                  className="w-11 h-11 rounded-md font-semibold cursor-pointer flex items-center justify-center bg-[#7269EF]"
                  onClick={() => onSendMessage()}
                >
                  <RiSendPlane2Fill className="fill-white" />
                </div>
              </div>
              {/* ICON SELECT */}
              <div
                className={`${
                  isIconSelect ? "w-[30%] h-40" : "w-0 h-0"
                } absolute bottom-[80%] right-[26%]  rounded-lg flex flex-col justify-center items-center overflow-hidden duration-300 transition-all z-[50] bg-white border shadow-lg`}
              >
                <div className="w-full flex justify-center items-center border-b bg-gradient-to-r from-pink-500 to-[#7269EF]">
                  <p className="text-white font-semibold">Icon</p>
                </div>
                <div className="bg-white w-[90%] h-[90%] grid grid-cols-7 items-center">
                  {iconList.map((val, index) => {
                    return (
                      <div className="group" key={index}>
                        <p
                          className="cursor-pointer hover:scale-110 duration-150 transition-all text-center group-hover:animate-bounce"
                          onClick={() => {
                            setInputChat(inputChat + val.icon);
                          }}
                        >
                          {val.icon}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <EmpyMessage />
          </>
        )}
      </div>
      {/* <CreateRoomChatModal /> */}
    </div>
  );
}
