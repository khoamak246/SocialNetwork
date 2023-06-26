import React, { useState } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import HomePage from "../homePage/HomePage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Profile from "../profilePage/Profile";
import Story from "../storyPage/Story";
import LoginAndResister from "../loginAndResgisterPage/LoginAndResister";
import { useEffect } from "react";
import UnknowPage from "../unknowPage/UnknowPage";
import { useDispatch, useSelector } from "react-redux";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import Message from "../../components/message/Message";
import PostDetail from "../../components/postComponent/PostDetail";
import EmbedPost from "../../components/postComponent/EmbedPost";
import { useCookies } from "react-cookie";
import {
  authAuthenticationState,
  currentUserSignInSelector,
  toggleSelector,
} from "../../redux/selectors/Selector";
import { userFindByExpectedValue } from "../../thunk/UserThunk";
import { authSignIn } from "../../thunk/AuthThunk";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { updateWithSocket } from "../../thunk/RoomThunk";

let stompClient = null;
export default function Router() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isDisplayNavAndFooter, setDisplayNavAndFooter] = useState(true);
  const authenticationState = useSelector(authAuthenticationState);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const toggleSelect = useSelector(toggleSelector);
  const [cookie, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    let checkPath = true;
    const hiddenMatchLocation = ["login", "register", "embed"];
    hiddenMatchLocation.forEach((val) => {
      if (location.pathname.includes(val)) {
        checkPath = false;
      }
    });
    setDisplayNavAndFooter(checkPath);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let blockScreenToggleArr = ["createPost", "comment", "editProfile"];
    let check = false;
    if (toggleSelect) {
      for (let i = 0; i < blockScreenToggleArr.length; i++) {
        const element = blockScreenToggleArr[i];
        if (toggleSelect.includes(element)) {
          check = true;
        }
      }
    }
    let scrollType = "auto";
    if (toggleSelect && check) {
      scrollType = "hidden";
    }
    document.querySelector("body").style.overflowY = scrollType;
  }, [toggleSelect]);

  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/register") {
      if (!authenticationState) {
        let username = cookie.username;
        let password = cookie.password;
        if (username && password) {
          let reSignInUser = {
            username,
            password,
          };
          dispatch(authSignIn(reSignInUser));
          if (currentUserSignIn.id === "") {
            dispatch(
              userFindByExpectedValue({
                value: cookie.username,
                token: cookie.token,
              })
            );
          }
        } else {
          navigate("/login");
        }
      } else {
        setCookie("token", authenticationState.token, {
          path: "/",
          maxAge: authenticationState.expiredTime,
        });
        let usernameAndPasswordCookieExpired = Date.now() + 604800000;
        setCookie("username", cookie.username, {
          path: "/",
          maxAge: usernameAndPasswordCookieExpired,
        });
        setCookie("password", cookie.password, {
          path: "/",
          maxAge: usernameAndPasswordCookieExpired,
        });
      }
    }
  }, [authenticationState, location.pathname]);

  return (
    <div>
      <div className="flex">
        <div
          className={`${
            location.pathname.includes("/message") ? "w-[6%]" : "w-[20%]"
          } border border-l-slate-500 ${
            !isDisplayNavAndFooter ? "hidden" : ""
          }`}
        >
          <Sidebar />
        </div>
        <div
          className={`${
            location.pathname.includes("/message") ? "w-[94%]" : "w-[80%]"
          } `}
        >
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/profile/:userId" element={<Profile />}>
              <Route path="post" element={<Profile />}></Route>
              <Route path="story" element={<Profile />}></Route>
              <Route path="saved" element={<Profile />}></Route>
              <Route path="tagged" element={<Profile />}></Route>
            </Route>

            <Route path="/message" element={<Message />}></Route>
            <Route path="/postDetail/:postId" element={<PostDetail />}></Route>
            <Route path="/embed/:postId" element={<EmbedPost />}></Route>
            <Route path="/s/:storyId" element={<Story />}></Route>
            <Route path="/login" element={<LoginAndResister />}></Route>
            <Route path="/register" element={<LoginAndResister />}></Route>
            <Route path="*" element={<UnknowPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
