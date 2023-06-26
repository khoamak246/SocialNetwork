import React, { useState } from "react";
import homephones2x from "../../assets/img/home-phones-2x.png";
import screenshot1 from "../../assets/img/screenshot1-2x.png";
import screenshot2 from "../../assets/img/screenshot2-2x.png";
import screenshot3 from "../../assets/img/screenshot3-2x.png";
import screenshot4 from "../../assets/img/screenshot4-2x.png";
import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSignIn, authSignUp } from "../../thunk/AuthThunk";
import * as validation from "../../utils/Validation";
import { authAuthenticationState } from "../../redux/selectors/Selector";
import { toast } from "react-hot-toast";
import { setDefaultAuthState } from "../../redux/reducers/AuthSlice";
import { useCookies } from "react-cookie";
import { userFindByExpectedValue } from "../../thunk/UserThunk";

export default function LoginAndResister() {
  const param = useLocation();
  const listScreen = [screenshot1, screenshot2, screenshot3, screenshot4];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isChangingSlide, setChangingSlide] = useState("");
  const [isLogin, setLogin] = useState(true);
  const navigate = useNavigate();
  const [registerInput, setRegisterInput] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [isToggleError, setToggleError] = useState("");
  const dispatch = useDispatch();
  const authAuthenticateSelector = useSelector(authAuthenticationState);
  const [siginInput, setSiginInput] = useState({
    username: "",
    password: "",
  });
  const [cookies, setCookie] = useCookies(["token", "username", "password"]);

  useEffect(() => {
    setToggleError("");
  }, [param.pathname]);

  useEffect(() => {
    if (authAuthenticateSelector) {
      if (authAuthenticateSelector.status !== "OK") {
        toast.error(`${authAuthenticateSelector.message}`, 1500);
      } else {
        if (param.pathname.includes("register")) {
          dispatch(setDefaultAuthState());
          navigate("/login");
        } else {
          setCookie("token", authAuthenticateSelector.token, {
            path: "/",
            maxAge: authAuthenticateSelector.expiredTime,
          });
          let usernameAndPasswordCookieExpired = Date.now() + 604800000;
          setCookie("username", siginInput.username, {
            path: "/",
            maxAge: usernameAndPasswordCookieExpired,
          });
          setCookie("password", siginInput.password, {
            path: "/",
            maxAge: usernameAndPasswordCookieExpired,
          });
          dispatch(
            userFindByExpectedValue({
              value: siginInput.username,
              token: authAuthenticateSelector.token,
            })
          ).then((res) => {
            if (res) {
              navigate("/");
            }
          });
        }
      }
    }
  }, [authAuthenticateSelector]);

  const handleOnInput = (event) => {
    let { name, value } = event.target;
    setRegisterInput({ ...registerInput, [name]: value });
  };

  const handleOnSignInInput = (event) => {
    let { name, value } = event.target;
    setSiginInput({ ...siginInput, [name]: value });
  };

  const handleRegister = () => {
    let isMatchersusernamePattern = new RegExp(validation.USER_NAME_REGEX).test(
      registerInput.username
    );

    let isMatchersPasswordPatten = new RegExp(validation.PASSWORD_REGEX).test(
      registerInput.password
    );

    let isMatchersFullNamePatten = new RegExp(validation.FULL_NAME_REGEX).test(
      registerInput.fullName
    );

    let isMatchersPhoneNumberPatten = new RegExp(
      validation.PHONE_NUMBER_REGEX
    ).test(registerInput.phoneNumber);

    let isMatchersEmailPatten = new RegExp(validation.EMAIL_REGEX).test(
      registerInput.email
    );

    let error = "";
    if (!isMatchersEmailPatten) {
      error = "email";
    } else if (!isMatchersPhoneNumberPatten) {
      error = "phoneNumber";
    } else if (!isMatchersFullNamePatten) {
      error = "fullName";
    } else if (!isMatchersusernamePattern) {
      error = "username";
    } else if (!isMatchersPasswordPatten) {
      error = "password";
    }

    if (error !== "") {
      setToggleError(error);
    } else {
      dispatch(authSignUp(registerInput));
    }
  };

  const handleOnSigIn = () => {
    let isMatchersusernamePattern = new RegExp(
      validation.LOGIN_USERNAME_REGEX
    ).test(siginInput.username);

    let isMatchersPasswordPatten = new RegExp(validation.PASSWORD_REGEX).test(
      siginInput.password
    );

    let error = "";
    if (!isMatchersusernamePattern) {
      error = "username";
    } else if (!isMatchersPasswordPatten) {
      error = "password";
    }
    if (error !== "") {
      setToggleError(error);
    } else {
      dispatch(authSignIn(siginInput));
    }
  };

  const changeSlideLogin = () => {
    setChangingSlide(true);
    setTimeout(() => {
      setCurrentSlide((prevCurrentSlide) => {
        let tempNextSlide = 0;
        if (prevCurrentSlide === listScreen.length - 1) {
          tempNextSlide = 0;
        } else {
          tempNextSlide = prevCurrentSlide + 1;
        }
        return tempNextSlide;
      });
      setChangingSlide(false);
    }, 500);
  };

  useEffect(() => {
    let intervalId = setInterval(() => {
      changeSlideLogin();
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    param.pathname.includes("login") ? setLogin(true) : setLogin(false);
  }, [param.pathname]);

  return (
    <div
      className="w-screen h-screen flex justify-center items-center"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (isLogin) {
            handleOnSigIn();
          } else {
            handleRegister();
          }
        }
      }}
    >
      <div className="w-[70%] h-[90%] flex justify-center items-center">
        <div className="w-[50%] h-full flex justify-center items-center relative">
          <img
            src={homephones2x}
            alt=""
            draggable={false}
            className="w-full h-full object-contain"
          />
          <div
            className={`absolute w-full h-full top-[1.5rem] left-[9.2rem] ${
              isChangingSlide ? "opacity-50" : "opacity-100"
            } duration-[1s] transition-all`}
          >
            <div>
              <img src={listScreen[currentSlide]} alt="" className="w-[56%]" />
            </div>
          </div>
        </div>
        <div
          className={`${
            isLogin ? "opacity-100 w-[50%]" : "opacity-0 w-0"
          }  h-full flex flex-col justify-center items-center gap-3 overflow-hidden transition-all duration-200`}
        >
          <div className="w-[80%] h-[70%] border flex items-center justify-center p-3">
            <div className="w-full h-full flex flex-col items-center gap-3 justify-between">
              <div className="h-[30%] flex justify-center items-center">
                <img src="http://i.imgur.com/zqpwkLQ.png" alt="" />
              </div>
              <div className="w-full h-[40%] flex flex-col justify-center items-center gap-4">
                <div className="w-full flex flex-col justify-center items-center">
                  <input
                    type="text"
                    name="username"
                    value={siginInput.username}
                    placeholder="Phone number, username or email ..."
                    className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                    onChange={handleOnSignInInput}
                  />
                  <p
                    className={`text-sm text-red-400 text-center ${
                      isToggleError !== "username" && "hidden"
                    }`}
                  >
                    {validation.ERROR_USER_NAME_RESS}
                  </p>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                  <input
                    type="password"
                    name="password"
                    value={siginInput.password}
                    placeholder="Password..."
                    className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                    onChange={handleOnSignInInput}
                  />
                  <p
                    className={`text-sm text-red-400 text-center ${
                      isToggleError !== "password" && "hidden"
                    }`}
                  >
                    {validation.ERROR_PASSWORD_MESS}
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-center items-start h-[40%]">
                <button
                  className="bg-[#4CB5F9] py-1 w-[80%] rounded-lg text-white font-semibold"
                  onClick={handleOnSigIn}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <div className="h-[15%] flex justify-center items-center w-full">
            <div className="h-full w-[80%] border flex justify-center items-center">
              <p>
                You don't have an account yet?{" "}
                <Link
                  to={"/register"}
                  className="text-[#5A97F6] font-semibold cursor-pointer"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
          <div className="h-[15%] flex flex-col justify-center items-center gap-2">
            <div className="text-sm">Get app in</div>
            <div className="flex w-[60%]">
              <div className="flex justify-center items-center w-full gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.instagram.android&hl=vi&gl=US"
                  className="w-52 h-10 items-center"
                >
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/y2/r/yKDBMIG1og3.png"
                    alt=""
                    className="w-full h-full"
                  />
                </a>
                <a
                  href="https://apps.microsoft.com/store/detail/instagram/9NBLGGH5L9XT"
                  className="w-52 h-10 items-center"
                >
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/ys/r/0evRgTlaFrn.png"
                    alt=""
                    className="w-full h-full"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${
            !isLogin ? "opacity-100 w-[50%]" : "opacity-0 w-0"
          } h-full flex flex-col justify-center items-center gap-3 overflow-hidden transition-all duration-300`}
        >
          <div className="w-[80%] h-[90%] flex flex-col items-center justify-center border gap-3">
            <div className="flex flex-col justify-center items-center text-[#737373]">
              <img src="http://i.imgur.com/zqpwkLQ.png" alt="" />
              <p className="text-lg text-center w-[80%]">
                Subscribe to see photos and videos from friends
              </p>
              <p className="text-sm text-center w-[80%]">
                Subscribe to see photos and videos from friends
              </p>
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  name="email"
                  type="text"
                  placeholder="Email..."
                  value={registerInput.email}
                  className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                  onChange={handleOnInput}
                />
                <p
                  className={`text-sm text-red-400 text-center ${
                    isToggleError !== "email" && "hidden"
                  }`}
                >
                  {validation.ERROR_EMAIL_MESS}
                </p>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phonenumber..."
                  value={registerInput.phoneNumber}
                  className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                  onChange={handleOnInput}
                  maxLength={10}
                />
                <p
                  className={`text-sm text-red-400 text-center ${
                    isToggleError !== "phoneNumber" && "hidden"
                  }`}
                >
                  {validation.ERROR_PHONE_NUMBER_MESS}
                </p>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  name="fullName"
                  type="text"
                  placeholder="Fullname..."
                  value={registerInput.fullName}
                  className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                  onChange={handleOnInput}
                />
                <p
                  className={`text-sm text-red-400 text-center ${
                    isToggleError !== "fullName" && "hidden"
                  }`}
                >
                  {validation.ERROR_FULL_NAME_MESS}
                </p>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  name="username"
                  type="text"
                  placeholder="Username..."
                  value={registerInput.username}
                  className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                  onChange={handleOnInput}
                />
                <p
                  className={`text-sm text-red-400 text-center ${
                    isToggleError !== "username" && "hidden"
                  }`}
                >
                  {validation.ERROR_USER_NAME_RESS}
                </p>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  name="password"
                  type="text"
                  placeholder="Password..."
                  value={registerInput.password}
                  className="w-[80%] text-[0.8rem] outline-[#a4a4a4] p-2 bg-[#FAFAFA] border-[#DBDBDB] border rounded"
                  onChange={handleOnInput}
                />
                <p
                  className={`text-sm text-red-400 text-center ${
                    isToggleError !== "password" && "hidden"
                  }`}
                >
                  {validation.ERROR_PASSWORD_MESS}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-center items-start">
              <button
                className="bg-[#4CB5F9] py-1 w-[80%] rounded-lg text-white font-semibold"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </div>
          <div className="h-[15%] flex justify-center items-center w-full">
            <div className="h-full w-[80%] border flex justify-center items-center">
              <p>
                Do you have an account?{" "}
                <Link
                  to={"/login"}
                  className="text-[#5A97F6] font-semibold cursor-pointer"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
          <div className="h-[15%] flex flex-col justify-center items-center gap-2">
            <div className="text-sm">Get app in</div>
            <div className="flex w-[60%]">
              <div className="flex justify-center items-center w-full gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.instagram.android&hl=vi&gl=US"
                  className="w-52 h-10 items-center"
                >
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/y2/r/yKDBMIG1og3.png"
                    alt=""
                    className="w-full h-full"
                  />
                </a>
                <a
                  href="https://apps.microsoft.com/store/detail/instagram/9NBLGGH5L9XT"
                  className="w-52 h-10 items-center"
                >
                  <img
                    src="https://static.cdninstagram.com/rsrc.php/v3/ys/r/0evRgTlaFrn.png"
                    alt=""
                    className="w-full h-full"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
