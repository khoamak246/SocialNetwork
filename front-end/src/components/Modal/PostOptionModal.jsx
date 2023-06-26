import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUserSignInSelector } from "../../redux/selectors/Selector";
import { toast } from "react-hot-toast";
import {
  putUnfollowerUser,
  userFindByExpectedValue,
} from "../../thunk/UserThunk";
import { useCookies } from "react-cookie";
import { POST_CREATE_NEW_COLLECTION } from "../../api/service/CollectionService";
import { savePostToCollection } from "../../thunk/ProfilePageThunk";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { reportReason } from "../../assets/js/report/ReportReason";
import { postReportPost } from "../../thunk/PostThunk";
import { updateSpecificPostInContent } from "../../thunk/HomePageThunk";

export default function PostOptionModal({
  post,
  setToggleModal,
  isSave,
  setSave,
}) {
  const [toggleModalLayout, setToggleModalLayout] = useState(false);
  const [toggleOContent, setToggleContent] = useState(false);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [subToggleSelect, setSubtoggleSelect] = useState(
    isSave ? "collectionSelect" : ""
  );
  const [inputNewCollection, setInputNewCollection] = useState("");
  const [cookie, setCookie] = useCookies();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
    if (isSave && setSave) {
      setSave(false);
    }
    setTimeout(() => {
      setToggleModal(false);
    }, 500);
  };

  const handleOnclickSaveCollectionButton = () => {
    if (currentUserSignIn.collection.length === 0) {
      toast.error(
        "OOP! There are no collections yet! Please create new collection to save post!",
        { duration: 3000 }
      );
    }
    setSubtoggleSelect("collectionSelect");
  };

  const handleCreateNewCollection = async () => {
    let pattern = /^[a-zA-Z0-9\s()-_/]{8,35}$/;

    if (pattern.test(inputNewCollection)) {
      let sendValue = {
        token: cookie.token,
        value: {
          name: inputNewCollection,
          userId: currentUserSignIn.id,
        },
      };

      let response = await POST_CREATE_NEW_COLLECTION(sendValue);
      if (response.status === 200) {
        toast.success("Create new collection successfully!", 2000);
        setInputNewCollection("");
        dispatch(
          userFindByExpectedValue({
            value: cookie.username,
            token: cookie.token,
          })
        );
        handleOnCloseModal();
      } else {
        console.log(response);
      }
    } else {
      toast.error(
        "OOP! Your password must be 8 - 35 character or contain invalid character",
        { duration: 4000 }
      );
    }
  };

  const handleSelectAddToCollection = async (collectionId) => {
    dispatch(savePostToCollection({ post, collectionId })).then((res) => {
      console.log(res);
      if (res) {
        dispatch(updateSpecificPostInContent(post));
        handleOnCloseModal();
      }
    });
  };

  const createEmbedLink = () => {
    let iframe = document.createElement("iframe");

    iframe.src = `http://localhost:5173/embed/${post.id}`;
    iframe.width = "700px";
    iframe.height = "500px";
    return iframe.outerHTML;
  };

  const copyClipBoard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard successfully!");
  };

  const handleCreateNewReport = (e) => {
    let { id } = e.target;
    let sendValue = {
      token: cookie.token,
      value: {
        userId: currentUserSignIn.id,
        postId: post.id,
        reportReason: id,
      },
    };

    dispatch(postReportPost(sendValue)).then((res) => {
      if (res) {
        toast.success(
          "Thanks for your contribution. All your opinions will bring better value to the community"
        );
      }
    });

    handleOnCloseModal();
  };

  const handleUnfollowUser = () => {
    let sendValue = {
      token: cookie.token,
      userId: currentUserSignIn.id,
      followerId: post.user.id,
    };

    dispatch(putUnfollowerUser(sendValue)).then((res) => {
      if (res) {
        dispatch(
          userFindByExpectedValue({
            value: cookie.username,
            token: cookie.token,
          })
        );
        toast.success("Unfollow successfully!", { duration: 2000 });
        handleOnCloseModal();
      }
    });
  };

  return (
    <div
      className={`z-50 fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center bg-black bg-opacity-60 overflow-hidden duration-300 transition-all ${
        toggleModalLayout ? "scale-100" : "scale-0"
      }`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        onClick={handleOnCloseModal}
      ></div>

      {/* REPORT */}
      <div
        className={` bg-white flex flex-col rounded-xl ${
          toggleOContent && subToggleSelect === "report"
            ? "h-[85%] w-[30%]"
            : "h-0 w-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="w-full h-[20%] border-b flex flex-col p-5 justify-center items-center cursor-pointer ">
          <p className="text-xl font-semibold">Your reason</p>
          <p className="text-sm">Why don't you like this post?</p>
        </div>
        {reportReason.map((val, index) => {
          return (
            <div
              id={val.id}
              key={index}
              className="w-full h-[20%] border-b flex justify-between items-center cursor-pointer hover:bg-slate-100 px-5"
              onClick={handleCreateNewReport}
            >
              <p id={val.id} className="text-sm">
                {val.title}
              </p>
              <RiArrowRightSLine id={val.id} className="w-5 h-5" />
            </div>
          );
        })}
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setSubtoggleSelect("")}
        >
          <p className="text-sm text-red-500 font-semibold">Cancel</p>
        </div>
      </div>

      {/* EMBED */}
      <div
        className={` bg-white flex flex-col rounded-xl ${
          toggleOContent && subToggleSelect === "embed"
            ? "max-h-[70%] w-[35%]"
            : "h-0 w-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="w-full h-[20%] border-b flex flex-col gap-2 justify-center items-center cursor-pointer hover:bg-slate-100 p-2">
          <p className="text-xl">Embed link</p>
          <p className="text-sm">
            By using this embed code, you agree to our API Terms of Use
          </p>
        </div>
        <div className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer">
          <input
            type="text"
            placeholder="Collection name..."
            className="w-full outline-none border rounded p-1 text-blue-500"
            value={createEmbedLink()}
            onChange={() => {
              toast.error("Can not edit value embed!", { duration: 1500 });
            }}
          />
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100 p-2"
          onClick={() => copyClipBoard(createEmbedLink())}
        >
          <p className="text-sm text-red-500 font-semibold">Copy</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100 p-2"
          onClick={() => setSubtoggleSelect("")}
        >
          <p className="text-sm text-red-500 font-semibold">Cancel</p>
        </div>
      </div>

      {/* CREATE NEW COLLECTION */}
      <div
        className={` bg-white flex flex-col rounded-xl ${
          toggleOContent && subToggleSelect === "createNewPost"
            ? "max-h-[70%] w-[30%]"
            : "h-0 w-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="w-full h-[20%] border-b flex flex-col gap-2 justify-center items-center cursor-pointer hover:bg-slate-100 p-2">
          <p className="text-xl">New collection</p>
          <p className="text-sm">Enter collection name below</p>
        </div>
        <div className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer  p-5">
          <input
            type="text"
            placeholder="Collection name..."
            className="w-full p-2"
            maxLength={35}
            value={inputNewCollection}
            onChange={(e) => setInputNewCollection(e.target.value)}
          />
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100 p-2"
          onClick={handleCreateNewCollection}
        >
          <p className="text-sm text-red-500 font-semibold">Create</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100 p-2"
          onClick={() => setSubtoggleSelect("collectionSelect")}
        >
          <p className="text-sm text-red-500 font-semibold">Cancel</p>
        </div>
      </div>

      {/* SELECT COLLECTION */}
      <div
        className={` bg-white flex flex-col rounded-xl ${
          toggleOContent && subToggleSelect === "collectionSelect"
            ? "max-h-[70%] w-[30%] overflow-auto no-scrollbar"
            : "h-0 w-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="w-full h-[20%] border-b flex flex-col gap-2 justify-center items-center cursor-pointer hover:bg-slate-100 p-2">
          <p className="text-xl">Select collection</p>
        </div>
        {currentUserSignIn &&
          currentUserSignIn.collection.map((val, index) => {
            return (
              <div
                key={index}
                className="w-full h-[20%] border-b flex justify-between px-5 py-2 items-center cursor-pointer hover:bg-slate-100"
                onClick={() => handleSelectAddToCollection(val.id)}
              >
                <p className="text-sm">{val.name}</p>
                <RiArrowRightSLine id={val.id} className="w-5 h-5" />
              </div>
            );
          })}
        <div className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100 p-2">
          <p
            className="text-sm text-red-500 font-semibold"
            onClick={() => setSubtoggleSelect("createNewPost")}
          >
            Create new post
          </p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100 p-2"
          onClick={() => {
            if (isSave && setSave) {
              handleOnCloseModal();
            } else {
              setSubtoggleSelect("");
            }
          }}
        >
          <p className="text-sm text-red-500 font-semibold">Cancel</p>
        </div>
      </div>

      {/* DEFAULT MODAL */}
      <div
        className={` bg-white flex flex-col rounded-xl ${
          toggleOContent && subToggleSelect === ""
            ? "h-[70%] w-[30%]"
            : "h-0 w-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setSubtoggleSelect("report")}
        >
          <p className="text-red-500 font-bold text-sm">Report</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={handleUnfollowUser}
        >
          <p className="text-red-500 font-bold text-sm">Unfollow</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={handleOnclickSaveCollectionButton}
        >
          <p className="text-sm">Add to collection</p>
        </div>
        <div
          className={`${
            location.pathname.includes("/postDetail") && "hidden"
          } w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100`}
          onClick={() => navigate(`/postDetail/${post.id}`)}
        >
          <p className="text-sm">Go to post</p>
        </div>
        <div className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100">
          <p className="text-sm">Share to...</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={() => {
            copyClipBoard(`http://localhost:5173/postDetail/${post?.id}`);
          }}
        >
          <p className="text-sm">Copy link</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setSubtoggleSelect("embed")}
        >
          <p className="text-sm">Embed</p>
        </div>
        <div
          className={`w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100`}
          onClick={() => navigate(`/profile/${post?.user.id}/post`)}
        >
          <p className="text-sm">About this account</p>
        </div>
        <div
          className="w-full h-[20%] border-b flex justify-center items-center cursor-pointer hover:bg-slate-100"
          onClick={handleOnCloseModal}
        >
          <p className="text-sm">Cancel</p>
        </div>
      </div>
    </div>
  );
}
