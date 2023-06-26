import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxDot, RxDotFilled } from "react-icons/rx";

export default function Slider({ listMeida }) {
  const [previewImgIndex, setPreviewImgIndex] = useState(0);
  const [isChangePreviewImg, setChangePreviewImg] = useState(true);

  const handleChangePreviewSlideImg = (event) => {
    let action = event.target.id;
    let hasPrevious = previewImgIndex !== 0;
    let hasNext = previewImgIndex !== listMeida.length - 1;
    let nextSlide = 0;
    if (action === "forwardSlide") {
      nextSlide = hasNext ? previewImgIndex + 1 : 0;
    } else {
      nextSlide = hasPrevious ? previewImgIndex - 1 : listMeida.length - 1;
    }
    setChangePreviewImg(false);
    setTimeout(() => {
      setChangePreviewImg(true);
      setPreviewImgIndex(nextSlide);
    }, 400);
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <div
        id="backSlide"
        className={`${
          listMeida.length === 1 && "hidden"
        } absolute top-[50%] left-[3%] cursor-pointer text-white text-2xl`}
        onClick={handleChangePreviewSlideImg}
      >
        <IoIosArrowBack />
      </div>
      {listMeida.length > 0 && listMeida[previewImgIndex].type === "img" ? (
        <>
          <img
            src={listMeida.length > 0 && listMeida[previewImgIndex].url}
            alt=""
            className={`w-full ${
              isChangePreviewImg ? "opacity-100" : "opacity-0"
            } transition-all duration-300`}
            draggable={false}
          />
        </>
      ) : (
        <>
          <video
            src={`${
              listMeida.length > 0 ? listMeida[previewImgIndex].url : ""
            }`}
            alt=""
            className={`w-full h-full ${
              isChangePreviewImg ? "opacity-100" : "opacity-0"
            } transition-all duration-300`}
            controls={true}
            draggable={false}
          />
        </>
      )}

      <div
        id="forwardSlide"
        className={`${
          listMeida.length === 1 && "hidden"
        } absolute top-[50%] right-[3%] cursor-pointer text-white text-2xl`}
        onClick={handleChangePreviewSlideImg}
      >
        <IoIosArrowForward />
      </div>
      <div
        className={`${
          listMeida.length === 1 && "hidden"
        } flex absolute bottom-0 justify-center w-full`}
      >
        {listMeida.map((val, index) => {
          return previewImgIndex === index ? (
            <RxDotFilled
              key={index}
              className={`text-white transition-all duration-300 ${
                isChangePreviewImg ? "scale-150" : "scale-0"
              }`}
            />
          ) : (
            <RxDot key={index} className="text-white" />
          );
        })}
      </div>
    </div>
  );
}
