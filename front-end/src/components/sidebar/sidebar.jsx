import React, { useState } from "react";
import { IoReorderFour } from "react-icons/io5";
import { mainu } from "../../assets/js/sidebar/SidebarConfig";
import { useLocation, useNavigate } from "react-router-dom";
import CreatePostModal from "../Modal/CreatePostModal";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserSignInSelector,
  toggleSelector,
} from "../../redux/selectors/Selector";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import { useEffect } from "react";
import {
  GET_USER_RELATIVE_VALUE,
  POST_CREATE_USER_FOLLOWER,
} from "../../api/service/UserService";
import { useCookies } from "react-cookie";
import FollowSuggestion from "../followSuggestions/FollowSuggestion";
import { userFindByExpectedValue } from "../../thunk/UserThunk";

export default function sidebar() {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const getToggleSelector = useSelector(toggleSelector);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [currentUserSignInInfo, setCurrentUserSignInInfo] =
    useState(currentUserSignIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const [inputSearch, setInputSearch] = useState("");
  const [cookie] = useCookies();
  const [isSearching, setSearching] = useState({
    searching: false,
    notFoundResponse: false,
  });
  const [responseSuccess, setResponseSuccess] = useState([]);
  const [selectFollower, setSellectFollower] = useState();

  useEffect(() => {
    let path = location.pathname;

    const activeNavArr = [
      { path: "/", active: "Home" },
      {
        path: "/profile",
        active: "Profile",
      },
      {
        path: "/message",
        active: "Message",
      },
    ];
    activeNavArr.forEach((val) => {
      if (path === val.path) {
        setActiveTab(val.active);
        return;
      } else if (path.includes("/profile")) {
        setActiveTab(activeNavArr[1].active);
        return;
      }
    });
    handleResetAllField();
  }, [location.pathname]);

  useEffect(() => {
    currentUserSignInInfo && setCurrentUserSignInInfo(currentUserSignInInfo);
  }, [currentUserSignInInfo]);

  const handleTabClick = (title) => {
    let cleanToggle = null;
    if (title === "Profile") {
      dispatch(setOpenToggle(cleanToggle));
      navigate(`/profile/${currentUserSignIn.id}/post`);
    } else if (title === "Home") {
      dispatch(setOpenToggle(cleanToggle));
      navigate("/");
    } else if (title === "Search") {
      let nextToggle = "search";
      if (getToggleSelector === "search") {
        handleResetAllField();
        nextToggle = null;
      }
      dispatch(setOpenToggle(nextToggle));
    } else if (title === "Create") {
      let nextToggle = "createPost";
      if (getToggleSelector === "createPost") {
        nextToggle = null;
      }
      dispatch(setOpenToggle(nextToggle));
    } else if (title === "Message") {
      navigate("/message");
    }
  };

  const handleOnChangeInputSearch = (event) => {
    let { value } = event.target;
    if (value.length > 0) {
      setSearching({
        searching: true,
        notFoundResponse: false,
      });
    } else {
      setSearching({
        searching: false,
        notFoundResponse: false,
      });
    }
    setResponseSuccess([]);
    setInputSearch(value);
  };

  const handleOnClearInputSearch = () => {
    setInputSearch("");
    setResponseSuccess([]);
    setSearching({
      searching: false,
      notFoundResponse: false,
    });
  };

  useEffect(() => {
    async function fetchData() {
      let sendValue = {
        token: cookie.token,
        value: inputSearch,
      };
      let response = await GET_USER_RELATIVE_VALUE(sendValue);
      if (response.status === 404) {
        setSearching({ ...isSearching, notFoundResponse: true });
      } else {
        setResponseSuccess([...response.data.data]);
      }
    }

    let timeoutId = setTimeout(() => {
      if (inputSearch.length !== 0) {
        fetchData();
      } else {
        clearTimeout(timeoutId);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputSearch]);

  const handleResetAllField = () => {
    setSellectFollower();
    setResponseSuccess([]);
    setSearching({
      searching: false,
      notFoundResponse: false,
    });
    setInputSearch("");
  };

  return (
    <>
      <div
        className={`sticky top-0 h-[100vh] z-[20] bg-white overflow-hidden ${
          (getToggleSelector === "search" || activeTab == "Message") &&
          "w-[6vw] border-r"
        } duration-300 transition-all`}
      >
        <div
          className={`flex flex-col justify-between h-full  gap-3 ${
            getToggleSelector === "search" || activeTab == "Message"
              ? "px-4"
              : "px-7"
          } duration-300 transition-all`}
        >
          <div>
            <div className="pt-10 cursor-pointer">
              {getToggleSelector !== "search" && activeTab !== "Message" ? (
                <img
                  className="w-28"
                  src="http://i.imgur.com/zqpwkLQ.png"
                  alt="home-logo"
                  draggable={false}
                  onClick={() => navigate("/")}
                />
              ) : (
                <div className="p-2 cursor-pointer">
                  <svg
                    aria-label="Instagram"
                    className="x1lliihq x1n2onr6 cursor-pointer"
                    color="rgb(0, 0, 0)"
                    fill="rgb(0, 0, 0)"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                    onClick={() => navigate("/")}
                  >
                    <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-3">
              {mainu.map((item, index) => (
                <div
                  onClick={() => handleTabClick(item.title)}
                  className="flex items-center cursor-pointer text-lg group rounded-lg p-2 hover:bg-[#F2F2F2] transition-all duration-100 gap-4"
                  key={index}
                >
                  {item.title !== "Profile" ? (
                    activeTab === item.title ? (
                      item.activeIcon
                    ) : (
                      item.icon
                    )
                  ) : (
                    <img
                      className="w-6 h-6 rounded-full"
                      src={currentUserSignIn.userInfo.avatar}
                      alt="Rounded avatar"
                    ></img>
                  )}
                  <p
                    className={`${
                      activeTab === item.title ? "font-bold" : "font-normal"
                    } ${
                      (getToggleSelector === "search" ||
                        activeTab == "Message") &&
                      "hidden"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-[100vh] z-10 flex rounded-r-xl shadow-2xl shadow-[#745630] bg-white overflow-hidden ${
          getToggleSelector === "search" ? "w-[40vw]" : "w-0"
        } transition-all duration-300`}
      >
        <div className="w-[15%]"></div>
        <div className="w-[85%] h-full flex flex-col">
          <div className="h-[28%] border-b flex justify-center items-center">
            <div className="bg-white w-[90%] h-[90%] flex flex-col justify-between py-5 relative">
              <p className="text-2xl font-semibold">Search</p>
              <input
                type="text"
                placeholder="Search..."
                value={inputSearch}
                className="bg-[#EFEFEF] w-full rounded py-2 px-3 outline-none"
                onChange={handleOnChangeInputSearch}
              />
              <MdOutlineCancel
                className="absolute bottom-[20%] right-[5%] fill-[#C7C7C7] cursor-pointer"
                onClick={handleOnClearInputSearch}
              />
            </div>
          </div>
          <div className="flex flex-col py-2 px-5 h-[72%]">
            <div className="font-semibold">Recently</div>
            <div
              className={`${
                responseSuccess.length === 0 && "hidden"
              } w-full h-[90%] flex flex-col justify-start gap-3 pt-3 max-h-full overflow-auto no-scrollbar`}
            >
              {responseSuccess?.map((val, index) => {
                if (val?.id !== currentUserSignIn?.id) {
                  return (
                    <FollowSuggestion type={"search"} key={index} user={val} />
                  );
                }
              })}
            </div>
            <div
              className={`${
                responseSuccess.length !== 0 && "hidden"
              } w-full h-[90%] flex flex-col justify-center items-center`}
            >
              <div className={`${!isSearching.searching && "hidden"}`}>
                <img
                  src={`${
                    isSearching.notFoundResponse
                      ? "https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/search-no-result-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg?alt=media&token=1d715e0b-2d51-4ef6-96e4-3db98ced8d61&_gl=1*1530eqy*_ga*MTQ1NTk1MTE3OS4xNjg2NTU2NDU1*_ga_CW55HF8NVT*MTY4NjU1NjQ1NC4xLjEuMTY4NjU1OTk1NS4wLjAuMA.."
                      : "https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/loadingGif2.gif?alt=media&token=b65b5143-1259-4ebd-b37e-1a10c5a97813&_gl=1*1eq2x9y*_ga*MTQ1NTk1MTE3OS4xNjg2NTU2NDU1*_ga_CW55HF8NVT*MTY4NjU1NjQ1NC4xLjEuMTY4NjU1ODE3NS4wLjAuMA.."
                  }`}
                  alt=""
                  draggable={false}
                />
              </div>
              <p
                className={`${
                  inputSearch.length > 0 && "hidden"
                } text-[#737373] text-sm font-bold`}
              >
                No recent searches
              </p>
            </div>
          </div>
        </div>
      </div>
      {getToggleSelector === "createPost" && <CreatePostModal />}
    </>
  );
}
