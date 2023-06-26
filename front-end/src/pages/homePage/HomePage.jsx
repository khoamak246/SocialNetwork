import React from "react";
import StoryCircle from "../../components/storyComponent/storyCircle";
import PostCard from "../../components/postComponent/PostCard";
import FollowSuggestion from "../../components/followSuggestions/FollowSuggestion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  authAuthenticationState,
  currentUserSignInSelector,
  homePageContentSelector,
  isStillHavingContentSelector,
  pagingSortingSelector,
  storySelector,
} from "../../redux/selectors/Selector";
import { useCookies } from "react-cookie";
import { authSignIn } from "../../thunk/AuthThunk";
import {
  getSuggestionUser,
  userFindByExpectedValue,
} from "../../thunk/UserThunk";
import { GET_FIND_POST_BY_ID } from "../../api/service/PostService";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { postCreateHomePagePostCollection } from "../../thunk/HomePageThunk";
import {
  setPageSortingFetchingPage,
  setResetHomePage,
} from "../../redux/reducers/HomePageSlice";
import { getStoryInDay } from "../../thunk/PostThunk";
import { POST_CREATE_USER_FOLLOWER } from "../../api/service/UserService";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pagingSorting = useSelector(pagingSortingSelector);
  const homePageContent = useSelector(homePageContentSelector);
  const isStillHavingContent = useSelector(isStillHavingContentSelector);
  const storyList = useSelector(storySelector);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [cookie, setCookie] = useCookies();
  const [recommentList, setRecommendList] = useState([]);
  const [selectFollower, setSellectFollower] = useState();
  const authenticationState = useSelector(authAuthenticationState);
  const location = useLocation();

  useEffect(() => {
    if (currentUserSignIn.id !== "") {
      let sendValue = {
        token: cookie.token,
        userId: currentUserSignIn.id,
      };
      dispatch(getSuggestionUser(sendValue)).then((res) => {
        if (res) {
          setRecommendList(res);
        }
      });
    }
  }, [authenticationState, location.pathname]);

  const handleFormatCurrentDay = () => {
    let day = new Date();
    return `${day.getFullYear()}-${day.getMonth() + 1}-${
      day.getDate() - pagingSorting.dateMinus
    }`;
  };

  useEffect(() => {
    async function fetchData() {
      let sendValue = {
        token: cookie.token,
        value: {
          userId: currentUserSignIn.id,
          paging: pagingSorting.page,
          size: pagingSorting.size,
          date: handleFormatCurrentDay(),
          type: "post",
        },
      };
      dispatch(postCreateHomePagePostCollection(sendValue));
    }

    if (authenticationState !== null) {
      fetchData();
    }
  }, [authenticationState, pagingSorting, location.pathname]);

  useEffect(() => {
    if (currentUserSignIn.id !== "") {
      let sendValue = {
        token: cookie.token,
        value: {
          userId: currentUserSignIn.id,
          date: handleFormatCurrentDay(),
        },
      };
      dispatch(getStoryInDay(sendValue));
    }
  }, [authenticationState]);

  return (
    <div className="w-full pt-11">
      <div className="flex w-full">
        <div className="w-[70%]">
          <div className="flex gap-6 w-[90%] justify-start px-10 overflow-auto no-scrollbar">
            {storyList &&
              storyList.map((val, index) => {
                return <StoryCircle key={index} post={val} />;
              })}
          </div>

          <div className="space-y-10 w-full mt-10 flex justify-center flex-col items-center">
            {homePageContent.map((val, index) => {
              if (val.privacy) {
                return <PostCard key={index} index={index} post={val} />;
              }
            })}
          </div>
          <div
            className={`${
              isStillHavingContent && "hidden"
            } w-full mt-10 flex justify-center flex-col items-center`}
          >
            <div className="border-t w-[60%] flex justify-center items-center pt-10">
              <img
                className="w-20 h-20"
                src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/illo-confirm-refresh-light.png?alt=media&token=562b4b19-bcea-4e68-aa5d-0bbb0f88a86b&_gl=1*io460p*_ga*MTQ1NTk1MTE3OS4xNjg2NTU2NDU1*_ga_CW55HF8NVT*MTY4NjU4NzkxMC4zLjEuMTY4NjU4NzkzMC4wLjAuMA.."
                alt=""
                draggable={false}
              />
            </div>
            <p className="text-xl">OOP! No more posts to display</p>
            <p className="text-sm text-[#737373] pb-10 border-b">
              Follow more friends for more latest posts
            </p>
          </div>
          <div
            className={`${
              !isStillHavingContent && "hidden"
            } w-full mt-10 flex justify-center items-center`}
          >
            <div
              className="w-[60%] flex justify-center items-center pb-10"
              onClick={() =>
                dispatch(setPageSortingFetchingPage(pagingSorting.page + 1))
              }
            >
              <p className="text-center cursor-pointer text-blue-600">
                See more
              </p>
              <MdArrowDropDown className="w-8 h-8 fill-blue-600" />
            </div>
          </div>
        </div>

        <div className="w-[30%] pr-3 flex flex-col gap-3">
          <FollowSuggestion user={currentUserSignIn} />
          <div className="flex justify-between">
            <p className="text-sm text-[#848484] font-semibold">
              Suggestions for you
            </p>
            <p className="text-sm cursor-pointer font-semibold">See All</p>
          </div>
          <div className="flex flex-col gap-2">
            {recommentList.map((val, index) => {
              if (index < 6) {
                return <FollowSuggestion user={val} key={val.id} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
