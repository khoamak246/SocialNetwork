import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUserSignInSelector } from "../../redux/selectors/Selector";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { useCookies } from "react-cookie";
import { putUpdateUser, userFindByExpectedValue } from "../../thunk/UserThunk";
import * as validation from "../../utils/Validation";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetail } from "../../thunk/ProfilePageThunk";
import { setOpenToggle } from "../../redux/reducers/ToggleSlice";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/Firebase";

export default function EditProfileModal() {
  const [toggleModalLayout, setToggleModalLayout] = useState(false);
  const [toggleOContent, setToggleContent] = useState(false);
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [activeSubTab, setActiveSubTab] = useState("profile");
  const [inputProfile, setInputProfile] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    introduce: "",
  });
  const [activeInput, setActiveInput] = useState("");
  const [cookie, removeCookie] = useCookies();
  const dispatch = useDispatch();
  const [inputPassword, setInputPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();
  const param = useParams();
  const [fileUpload, setFileUpload] = useState({
    previewUrl: "",
    file: null,
  });

  const handleClickOutToSave = async () => {
    let isMatchersFullNamePatten = new RegExp(validation.FULL_NAME_REGEX).test(
      inputProfile.fullName
    );

    let isMatchersPhoneNumberPatten = new RegExp(
      validation.PHONE_NUMBER_REGEX
    ).test(inputProfile.phoneNumber);

    let isMatchersEmailPatten = new RegExp(validation.EMAIL_REGEX).test(
      inputProfile.email
    );

    if (!isMatchersFullNamePatten) {
      toast.error(validation.ERROR_FULL_NAME_MESS, { duration: 2000 });
      setInputProfile({
        ...inputProfile,
        fullName: currentUserSignIn.fullName,
      });
    } else if (!isMatchersPhoneNumberPatten) {
      toast.error(validation.ERROR_PHONE_NUMBER_MESS, { duration: 2000 });
      setInputProfile({
        ...inputProfile,
        fullName: currentUserSignIn.phoneNumber,
      });
    } else if (!isMatchersEmailPatten) {
      toast.error(validation.ERROR_EMAIL_MESS, { duration: 2000 });
      setInputProfile({
        ...inputProfile,
        fullName: currentUserSignIn.email,
      });
    } else {
      await sendNewProfile();
    }
    setActiveInput("");
  };

  const sendNewProfile = async () => {
    let sendvalue = {
      token: cookie.token,
      userId: currentUserSignIn.id,
      value: {
        updateField: [],
      },
    };

    for (const key in inputProfile) {
      if (key !== "introduce") {
        if (currentUserSignIn[key] !== inputProfile[key]) {
          sendvalue = {
            ...sendvalue,
            value: {
              ...sendvalue.value,
              [key]: inputProfile[key],
              updateField: [...sendvalue.value.updateField, key],
            },
          };
        }
      } else {
        if (currentUserSignIn.userInfo[key] !== inputProfile[key]) {
          sendvalue = {
            ...sendvalue,
            value: {
              ...sendvalue.value,
              [key]: inputProfile[key],
              updateField: [...sendvalue.value.updateField, key],
            },
          };
        }
      }
    }

    if (sendvalue.value.updateField.length !== 0) {
      dispatch(putUpdateUser(sendvalue)).then((res) => {
        if (res) {
          dispatch(
            getUserDetail({
              token: cookie.token,
              userId: param.userId,
            })
          ).then((res) => {
            if (!res) {
              navigate("*");
            }
          });
          dispatch(
            userFindByExpectedValue({
              value: cookie.username,
              token: cookie.token,
            })
          );
          toast.success("Your information has been updated", {
            duration: 2000,
          });
        } else {
          toast.error("Email or phone number are already exist!");
        }
      });
    }
  };

  const handleChangePassword = async () => {
    if (inputPassword.currentPassword !== cookie.password) {
      return toast.error("OOP! your current password not match!");
    }
    let isMatchersPasswordPatten = new RegExp(validation.PASSWORD_REGEX).test(
      inputPassword.newPassword
    );

    if (!isMatchersPasswordPatten) {
      return toast.error(validation.ERROR_PASSWORD_MESS, { duration: 2000 });
    }

    let sendValue = {
      token: cookie.token,
      userId: currentUserSignIn.id,
      value: {
        currentPassword: inputPassword.currentPassword,
        newPassword: inputPassword.newPassword,
        updateField: ["password"],
      },
    };
    dispatch(putUpdateUser(sendValue)).then((res) => {
      if (res) {
        removeCookie("username", { path: "/" });
        removeCookie("password", { path: "/" });
        removeCookie("token", { path: "/" });
        navigate("/login");
      }
    });
  };

  const handleActiveTab = (e) => {
    let { name } = e.target;
    setActiveInput(name);
  };

  useEffect(() => {
    if (activeInput.length !== 0) {
      let inputSelect = document.getElementById(activeInput);
      let value = inputSelect.value.length;
      inputSelect.focus();
      inputSelect.setSelectionRange(value, value);
    }
  }, [activeInput]);

  const handleOnchangeInput = (e) => {
    let { name, value } = e.target;
    setInputProfile({ ...inputProfile, [name]: value });
  };

  useEffect(() => {
    if (currentUserSignIn) {
      setInputProfile({
        fullName: currentUserSignIn.fullName,
        phoneNumber: currentUserSignIn.phoneNumber,
        email: currentUserSignIn.email,
        introduce: currentUserSignIn.userInfo.introduce,
      });
    }
  }, [currentUserSignIn]);

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
      dispatch(setOpenToggle(null));
    }, 500);
  };

  const handleOnChangeInputFile = (e) => {
    URL.revokeObjectURL(fileUpload.previewUrl);
    let file = e.target.files;
    if (file && file[0].type.startsWith("image")) {
      setFileUpload({
        previewUrl: URL.createObjectURL(file[0]),
        file: file[0],
      });
    }
  };

  const handleUploadFirebase = () => {
    const imageRef = ref(storage, `image/${fileUpload.file.name + v4()}`);
    uploadBytes(imageRef, fileUpload.file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        let sendvalue = {
          token: cookie.token,
          userId: currentUserSignIn.id,
          value: {
            avatarUrl: url,
            updateField: ["avatar"],
          },
        };

        dispatch(putUpdateUser(sendvalue)).then((res) => {
          if (res) {
            dispatch(
              getUserDetail({
                token: cookie.token,
                userId: param.userId,
              })
            ).then((res) => {
              if (!res) {
                navigate("*");
              }
            });
            dispatch(
              userFindByExpectedValue({
                value: cookie.username,
                token: cookie.token,
              })
            );
            toast.success("Your information has been updated", {
              duration: 2000,
            });
            setFileUpload({
              previewUrl: "",
              file: null,
            });
          }
        });
      });
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
      <div
        className={` bg-white flex rounded-xl ${
          toggleOContent ? "h-[80%] w-[60%]" : "h-0 w-0"
        } duration-300 transition-all overflow-hidden z-20`}
      >
        <div className="w-[35%] h-full flex flex-col justify-between items-center py-3 border-r shadow-lg bg-[#F5F5F5] backdrop-filter backdrop-blur bg-opacity-50 opacity-100 shadow-slate-100 transition-all duration-300">
          <div className="relative flex flex-col justify-center items-center">
            <img
              className="w-40 h-40 rounded-full"
              src={`${
                fileUpload.previewUrl !== ""
                  ? fileUpload.previewUrl
                  : currentUserSignIn?.userInfo.avatar
              }`}
              alt=""
              draggable={false}
            />
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              multiple={false}
              accept="image/*"
              onChange={handleOnChangeInputFile}
            />
            <button
              className={`${
                !fileUpload.file && "hidden"
              } mt-4 bg-orange-400 rounded-md py-1 text-white font-semibold w-[80%] z-[50]`}
              onClick={handleUploadFirebase}
            >
              Save
            </button>
          </div>
          <div className="w-full">
            <div
              className="p-3 cursor-pointer hover:bg-slate-200 w-full grid grid-cols-3"
              onClick={() => setActiveSubTab("profile")}
            >
              <div className="flex justify-end items-center">
                <CgProfile className="w-4 h-4" />
              </div>
              <div className="flex gap-2 items-center pl-2">
                <p className="text-[1.1rem]">Profile</p>
              </div>
              <div></div>
            </div>
            <div
              className="p-3 cursor-pointer hover:bg-slate-200 w-full grid grid-cols-3"
              onClick={() => setActiveSubTab("password")}
            >
              <div className="flex justify-end items-center">
                <RiLockPasswordLine className="w-4 h-4" />
              </div>
              <div className="flex gap-2 items-center pl-2">
                <p className="text-[1.1rem]">Password</p>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div
          className={`${
            activeSubTab !== "profile" ? "w-0" : "w-[65%]"
          }  h-full flex justify-center items-center overflow-hidden duration-300 transition-all`}
        >
          <div className="w-[95%] h-[95%] flex flex-col gap-5 pl-3 relative">
            <div
              className="absolute top-0 left-0 w-full h-full z-[10]"
              onClick={() => handleClickOutToSave()}
            ></div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="font-semibold">
                Full name
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="border border-slate-400 rounded-sm w-[50%] p-1 text-sm z-[50]"
                  value={inputProfile.fullName}
                  onChange={handleOnchangeInput}
                  disabled={activeInput !== "fullName"}
                />
                <img
                  name="fullName"
                  className="w-5 h-5 z-[50] cursor-pointer"
                  src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/editChoose.png?alt=media&token=6afee8ac-d9e1-48b2-87c3-de80133d3f34"
                  alt=""
                  onClick={handleActiveTab}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="font-semibold">
                Phone number
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="border border-slate-400 rounded-sm w-[50%] p-1 text-sm z-[50]"
                  value={inputProfile.phoneNumber}
                  onChange={handleOnchangeInput}
                  disabled={activeInput !== "phoneNumber"}
                />
                <img
                  name="phoneNumber"
                  className="w-5 h-5 z-[50] cursor-pointer"
                  src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/editChoose.png?alt=media&token=6afee8ac-d9e1-48b2-87c3-de80133d3f34"
                  alt=""
                  onClick={handleActiveTab}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="font-semibold">
                Email
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="border border-slate-400 rounded-sm w-[50%] p-1 text-sm z-[50]"
                  value={inputProfile.email}
                  onChange={handleOnchangeInput}
                  disabled={activeInput !== "email"}
                />
                <img
                  name="email"
                  className="w-5 h-5 z-[50] cursor-pointer"
                  src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/editChoose.png?alt=media&token=6afee8ac-d9e1-48b2-87c3-de80133d3f34"
                  alt=""
                  onClick={handleActiveTab}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold">
                Introduce
              </label>
              <div className="flex gap-2 items-center">
                <textarea
                  name="introduce"
                  id="introduce"
                  cols="78"
                  rows="10"
                  className="border border-slate-400 rounded-sm p-1 text-sm z-[50]"
                  value={inputProfile.introduce}
                  onChange={handleOnchangeInput}
                  disabled={activeInput !== "introduce"}
                ></textarea>
                <img
                  name="introduce"
                  className="w-5 h-5 z-[50] cursor-pointer"
                  src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/editChoose.png?alt=media&token=6afee8ac-d9e1-48b2-87c3-de80133d3f34"
                  alt=""
                  onClick={handleActiveTab}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PASSWORD */}
        <div
          className={`${
            activeSubTab !== "password" ? "w-0" : "w-[65%]"
          }  h-full flex justify-center items-center overflow-hidden duration-300 transition-all`}
        >
          <div className="w-[95%] h-[95%] flex flex-col gap-5 pl-3 relative">
            <div className="flex flex-col gap-2 z-[50]">
              <label htmlFor="currentPassword" className="font-semibold">
                Current password
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="currentPassword"
                  className="border border-slate-400 rounded-sm w-[50%] p-1 text-sm"
                  value={inputPassword.currentPassword}
                  onChange={(e) =>
                    setInputPassword({
                      ...inputPassword,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 z-[50]">
              <label htmlFor="newPassword" className="font-semibold">
                New password
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="newPassword"
                  className="border border-slate-400 rounded-sm w-[50%] p-1 text-sm"
                  value={inputPassword.newPassword}
                  onChange={(e) =>
                    setInputPassword({
                      ...inputPassword,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="w-full flex justify-center items-center gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-400 py-1 px-5 text-white font-semibold rounded-md"
                onClick={() => handleChangePassword()}
              >
                Save
              </button>
              <button
                className="bg-slate-400 hover:bg-slate-500 py-1 px-5 text-white font-semibold rounded-md"
                onClick={() =>
                  setInputPassword({
                    currentPassword: "",
                    newPassword: "",
                  })
                }
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
