import {
  AiFillCompass,
  AiFillHeart,
  AiFillHome,
  AiFillMessage,
  AiFillPlusCircle,
  AiOutlineCompass,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlinePlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { RiVideoFill, RiVideoLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoReorderFourOutline, IoReorderFour } from "react-icons/io5";
export const mainu = [
  {
    title: "Home",
    icon: (
      <AiOutlineHome className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <AiFillHome className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Search",
    icon: (
      <AiOutlineSearch className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <AiOutlineSearch className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Explore",
    icon: (
      <AiOutlineCompass className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <AiFillCompass className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Reels",
    icon: (
      <RiVideoLine className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <RiVideoFill className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Message",
    icon: (
      <AiOutlineMessage className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <AiFillMessage className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Notification",
    icon: (
      <AiOutlineHeart className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <AiFillHeart className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Create",
    icon: (
      <AiOutlinePlusCircle className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <AiFillPlusCircle className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "Profile",
    icon: (
      <CgProfile className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <CgProfile className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
  {
    title: "More",
    icon: (
      <IoReorderFourOutline className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
    activeIcon: (
      <IoReorderFour className="text-2xl group-hover:scale-110 duration-100 transition-all" />
    ),
  },
];
