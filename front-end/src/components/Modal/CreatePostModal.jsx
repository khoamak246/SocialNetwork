import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import Slider from "../slider/Slider";
import ConfirmModal from "./ConfirmModal";
import { CiLocationOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import { storage } from "../../firebase/Firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-hot-toast";
import IconSelect from "../commentComponent/IconSelect";
import {
  allPostSelector,
  currentUserSignInSelector,
} from "../../redux/selectors/Selector";
import { postAddNewPost } from "../../thunk/PostThunk";
import { useCookies } from "react-cookie";
import { setResetDefaultPost } from "../../redux/reducers/PostSlice";
import LoadingModal from "./LoadingModal";
import { useNavigate } from "react-router-dom";

export default function CreatePostModal() {
  const [toggleModalLayout, setToggleModalLayout] = useState(false);
  const [toggleContent, setToggleContent] = useState(false);
  const [toggleShareOption, setToggleShareOption] = useState(false);
  const [toggleLoadingModal, setToggleLoadingModal] = useState({
    isLoading: false,
    postType: "",
  });
  const [fileUploadList, setUploadListFile] = useState([]);
  const [toFirebaseAssets, setToFirebaseAssets] = useState([]);
  const [isToggleConfirmModal, setToggleConfirmModal] = useState(false);
  const [isContinueCreatePost, setContinueCreatePost] = useState(false);
  const [toggleIconSelect, setToggleIconSelect] = useState(false);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [isPublicPost, setPublicPost] = useState(true);
  const uploadMediaInptut = useRef(null);
  const [cookie, setCookie] = useCookies();
  const [newPost, setNewPost] = useState({
    content: "",
    location: "",
    privacy: "",
    userId: currentUserSignIn.id,
  });
  const [uploadURL, setUploadURL] = useState([]);
  const allPost = useSelector(allPostSelector);
  const dispatch = useDispatch();
  const handleOnChangeNewPost = (event) => {
    let { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
  };
  const navigate = useNavigate();

  useEffect(() => {
    setNewPost({ ...newPost, privacy: isPublicPost ? "public" : "private" });
  }, [isPublicPost]);

  useEffect(() => {
    setTimeout(() => {
      setToggleModalLayout(true);
      setTimeout(() => {
        setToggleContent(true);
      }, 200);
    }, 100);
  }, []);

  const handleOnCloseModal = () => {
    handleRevokePreviewMedia(fileUploadList);
    setTimeout(() => {
      setToggleContent(false);
      setTimeout(() => {
        setToggleModalLayout(false);
      }, 200);
    }, 100);
    setTimeout(() => {
      dispatch(setOpenToggle(null));
    }, 500);
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

  const handleOnchangeMediaUploadInput = (event) => {
    handleRevokePreviewMedia(fileUploadList);
    let listFile = event.target.files;
    let isUploadFileValid = isListFileValid(listFile);
    if (isUploadFileValid) {
      let uploadFileArr = [];
      let firebaseUpload = [];
      for (let i = 0; i < listFile.length; i++) {
        if (listFile[i].type.startsWith("image")) {
          uploadFileArr.push({
            url: URL.createObjectURL(listFile[i]),
            type: "img",
          });
        } else {
          uploadFileArr.push({
            url: URL.createObjectURL(listFile[i]),
            type: "video",
          });
        }
        firebaseUpload.push(listFile[i]);
      }
      setUploadListFile([...uploadFileArr]);
      setToFirebaseAssets([...firebaseUpload]);
    }
  };

  const handleRevokePreviewMedia = (listMedia) => {
    if (listMedia.length !== 0) {
      listMedia.forEach((val) => {
        URL.revokeObjectURL(val.url);
      });
    }
  };

  const handlePressContinueCreatePostBtn = () => {
    setContinueCreatePost(true);
  };

  const handleSaveNewPost = (event) => {
    let { id } = event.target;
    console.log(id);
    setToggleLoadingModal({ isLoading: true, postType: id });
  };

  useEffect(() => {
    if (toggleLoadingModal.isLoading) {
      handleUploadToFirebase();
    }
  }, [toggleLoadingModal]);

  const handleUploadToFirebase = async () => {
    let tempArr = [];
    toFirebaseAssets.forEach((val) => {
      const imageRef = ref(storage, `image/${val.name + v4()}`);
      uploadBytes(imageRef, val).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          tempArr.push(
            url + `_assetType:${val.type.includes("image") ? "img" : "video"}`
          );
          setUploadURL([...tempArr]);
        });
      });
    });
  };

  useEffect(() => {
    let sendValue = {
      ...newPost,
      listImg: uploadURL,
      type: toggleLoadingModal.postType,
    };
    if (uploadURL.length == fileUploadList.length && uploadURL.length !== 0) {
      console.log(sendValue);
      let postValue = {
        sendValue,
        token: cookie.token,
      };
      dispatch(postAddNewPost(postValue));
    }
  }, [uploadURL]);

  useEffect(() => {
    if (allPost && !Array.isArray(allPost)) {
      if (allPost.status === "OK") {
        toast.success("Post succesfully!", 2000);
        handleOnCloseModal();
        if (allPost.data.type) {
          navigate(`/postDetail/${allPost.data.id}`);
        } else {
          navigate(`/s/${allPost.data.id}`);
        }
      } else {
        toast.error("OOP something wrong when upload post!", 2000);
      }
      setToggleLoadingModal({
        isLoading: false,
        postType: "",
      });
      dispatch(setResetDefaultPost());
    }
  }, [allPost]);

  return (
    <div
      className={`fixed z-[50] top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center bg-black bg-opacity-60 overflow-hidden duration-300 transition-all ${
        toggleModalLayout ? "scale-100" : "scale-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleOnCloseModal}
      ></div>
      <div
        className={`absolute top-[3%] right-[3%] text-white text-2xl z-10 cursor-pointer`}
        onClick={handleOnCloseModal}
      >
        <AiOutlineClose />
      </div>
      <div
        className={`${
          isContinueCreatePost ? "w-[55%]" : "w-[30%]"
        }  bg-white flex flex-col rounded-xl ${
          toggleContent ? "h-[70%]" : "h-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div
          className={`flex bg-white justify-center items-center border-b h-[10%] px-3 z-[50]`}
        >
          <div
            className={`flex items-center w-full h-full ${
              fileUploadList.length === 0 ? "justify-center" : "justify-between"
            }`}
          >
            <div
              className={`${
                fileUploadList.length === 0 && "hidden"
              } cursor-pointer`}
              onClick={() => {
                if (isContinueCreatePost) {
                  setContinueCreatePost(false);
                } else {
                  setToggleConfirmModal(true);
                }
              }}
            >
              <IoMdArrowBack />
            </div>
            <p className="text-sm font-semibold">Create new post</p>
            {isContinueCreatePost ? (
              <>
                <div className="relative">
                  <p
                    className={`text-[#1877F2] text-sm font-semibold cursor-pointer hover:text-[#f29b18] z-[50] ${
                      fileUploadList.length === 0 && "hidden"
                    }`}
                    onClick={() => {
                      setToggleShareOption(true);
                    }}
                  >
                    share
                  </p>
                  <div
                    className={`${
                      toggleShareOption
                        ? "w-44 h-44 border shadow-sm"
                        : "w-0 h-0"
                    } absolute top-0 right-0 bg-white z-10 grid grid-cols-1 items-center rounded-lg overflow-hidden duration-300 transition-all`}
                  >
                    <div className="text-sm font-semibold bg-gradient-to-r from-yellow-500 to-pink-500 h-full flex justify-center items-center">
                      <p className="text-center">Share with</p>
                    </div>
                    <div
                      id="post"
                      className="text-sm cursor-pointer hover:bg-slate-100 hover:scale-110 duration-200 transition-all h-full flex justify-center items-center border-b-[1px]"
                      onClick={handleSaveNewPost}
                    >
                      <p id="post" className="text-center">
                        Post
                      </p>
                    </div>
                    <div
                      id="story"
                      className="text-sm cursor-pointer hover:scale-110 duration-200 transition-all h-full flex justify-center items-center border-b-[1px] hover:bg-slate-100"
                      onClick={handleSaveNewPost}
                    >
                      <p id="story" className="text-center">
                        Story
                      </p>
                    </div>
                    <div
                      className="text-sm cursor-pointer hover:scale-110 duration-200 transition-all h-full flex justify-center items-center border-b-[1px] hover:bg-slate-100"
                      onClick={() => {
                        setToggleShareOption(false);
                      }}
                    >
                      <p className="text-center">Continue edit</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p
                  className={`text-[#1877F2] text-sm font-semibold cursor-pointer ${
                    fileUploadList.length === 0 && "hidden"
                  }`}
                  onClick={handlePressContinueCreatePostBtn}
                >
                  next
                </p>
              </>
            )}
          </div>
        </div>
        <div className="h-[90%] flex flex-col justify-center items-center gap-3 relative">
          {isContinueCreatePost ? (
            <div className="flex w-full h-full">
              <div className="w-[50%] flex justify-center items-center bg-[#e7e6e6]">
                <Slider listMeida={fileUploadList} />
              </div>
              <div className="w-[50%] flex flex-col justify-center items-center">
                <div className="h-[90%] border-b w-full">
                  <div
                    className="h-[15%] flex items-center justify-between"
                    onClick={() => setToggleIconSelect(false)}
                  >
                    <div className="flex gap-1 items-center py-3 px-4">
                      <img
                        draggable={false}
                        className="h-8 w-8 rounded-full"
                        src={currentUserSignIn.userInfo.avatar}
                      />
                      <div className="ml-3">
                        <span className="text-sm font-semibold antialiased block leading-tight">
                          {currentUserSignIn.fullName}
                        </span>
                      </div>
                    </div>

                    <div className="pr-4 flex items-center justify-center gap-2">
                      <p className="text-sm font-semibold">
                        {isPublicPost ? "public" : "private"}
                      </p>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value={isPublicPost ? "public" : "private"}
                            className="sr-only peer"
                            checked={isPublicPost}
                            onChange={() => setPublicPost(!isPublicPost)}
                          />
                          <div className="w-9 h-5 bg-orange-400 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="h-[85%]">
                    <div className="px-4 flex flex-col w-full h-full">
                      <div
                        className="h-[90%] border-b"
                        onClick={() => setToggleIconSelect(false)}
                      >
                        <textarea
                          cols="40"
                          rows="11"
                          maxLength={2200}
                          value={newPost.content}
                          name="content"
                          className="resize-none w-full h-full outline-none text-sm"
                          placeholder="Write your content..."
                          onChange={handleOnChangeNewPost}
                        ></textarea>
                      </div>
                      <div className="h-[10%] flex items-center justify-between relative">
                        {toggleIconSelect && (
                          <IconSelect
                            newPost={newPost}
                            setNewPost={setNewPost}
                          />
                        )}
                        <div className="text-sm text-[#737373] w-full">
                          <BsEmojiSmile
                            className="cursor-pointer"
                            onClick={() =>
                              setToggleIconSelect(!toggleIconSelect)
                            }
                          />
                        </div>
                        <div className="text-sm text-[#C7C7C7]">
                          {newPost.content.length}/2.200
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="h-[10%] w-full flex items-center px-4"
                  onClick={() => setToggleIconSelect(false)}
                >
                  <input
                    type="text h-full"
                    placeholder="Add location..."
                    name="location"
                    className="py-1 w-[90%] outline-none text-sm"
                    maxLength={255}
                    onChange={handleOnChangeNewPost}
                  />
                  <div className="flex w-[10%] justify-center items-center">
                    <CiLocationOn />
                  </div>
                </div>
              </div>
            </div>
          ) : fileUploadList.length == 0 ? (
            <>
              <input
                type="file"
                className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                ref={uploadMediaInptut}
                onChange={handleOnchangeMediaUploadInput}
                accept="image/*, video/*"
                multiple={true}
              />
              <svg
                className=""
                color="rgb(0, 0, 0)"
                fill="rgb(0, 0, 0)"
                height="77"
                role="img"
                viewBox="0 0 97.6 77.3"
                width="96"
              >
                <path
                  d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                  fill="currentColor"
                ></path>
                <path
                  d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                  fill="currentColor"
                ></path>
                <path
                  d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                  fill="currentColor"
                ></path>
              </svg>
              <div>
                <p className="text-lg">Drag photos and videos here</p>
              </div>
              <div className="z-20">
                <button
                  className="bg-[#0095F6] py-2 px-2 rounded-lg text-sm text-white font-semibold hover:bg-[#1877F2]"
                  onClick={() => {
                    uploadMediaInptut.current.click();
                  }}
                >
                  Choose from computer
                </button>
              </div>
            </>
          ) : (
            <Slider listMeida={fileUploadList} />
          )}
        </div>
      </div>
      {isToggleConfirmModal && (
        <ConfirmModal
          setToggleModal={setToggleConfirmModal}
          nextAction={handleOnCloseModal}
        />
      )}
      <LoadingModal isToggle={toggleLoadingModal.isLoading} />
    </div>
  );
}
