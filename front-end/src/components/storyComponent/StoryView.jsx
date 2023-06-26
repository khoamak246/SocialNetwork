import React, { useRef, useState } from "react";
import { useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { BsPause, BsPlay } from "react-icons/bs";
import { GoMute, GoUnmute } from "react-icons/go";

export default function StoryView({ stories }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextStoryDuration, setNextStoryDuration] = useState(5000);
  const [videoControl, setVideoControl] = useState({
    play: true,
    muted: true,
  });
  const [breakContent, setBreakContent] = useState([]);
  const storyRef = useRef(null);
  const [isExtendContent, setExtendContent] = useState(
    stories && stories.content.length < 82
  );

  const handleNextStory = () => {
    if (stories) {
      if (currentStoryIndex < stories.postImg.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
        setActiveIndex(activeIndex + 1);
      } else if (currentStoryIndex === stories.postImg.length - 1) {
        setCurrentStoryIndex(0);
        setActiveIndex(0);
      }
    }
  };

  const handleOnloadMetadataVideo = () => {
    setNextStoryDuration(storyRef.current.duration * 1000);
  };

  useEffect(() => {
    if (storyRef.current) {
      console.log(storyRef.current);
      let typeOfRef = storyRef.current.getAttribute("id");
      if (typeOfRef === "storyImg") {
        setNextStoryDuration(5000);
      }
    }
  }, [storyRef.current, stories]);

  useEffect(() => {
    let changeStoryId = setTimeout(() => {
      handleNextStory();
    }, nextStoryDuration);

    stories && setBreakContent([...stories.content.split("\\n")]);
    return () => clearTimeout(changeStoryId);
  }, [currentStoryIndex, storyRef.current, stories, nextStoryDuration]);

  return (
    <div>
      <div className="flex justify-center items-center h-[100vh] bg-black relative">
        <div
          className={`h-[90vh] w-[30vw] flex justify-center items-star blur-effect-theme`}
        >
          {stories?.postImg[currentStoryIndex].type ? (
            <>
              <img
                id="storyImg"
                ref={storyRef}
                className="w-full object-contain"
                src={`${stories?.postImg[currentStoryIndex].url}`}
                draggable={false}
              ></img>
            </>
          ) : (
            <>
              <video
                id="storyVideo"
                ref={storyRef}
                className="w-full object-contain"
                src={`${stories?.postImg[currentStoryIndex].url}`}
                onLoadedMetadata={handleOnloadMetadataVideo}
                autoPlay={true}
                playsInline={true}
                muted={videoControl.muted}
                draggable={false}
              ></video>
            </>
          )}
        </div>
        <div className="absolute bottom-[10%] left-[33%] overflow-hidden w-[30vw]">
          <div
            className={`${
              isExtendContent ? "max-h-40" : "max-h-10"
            } w-[90%] overflow-hidden flex flex-col transition-all duration-300`}
          >
            {breakContent.map((val, index) => {
              return (
                <p key={index} className="text-white text-sm">
                  {val}
                </p>
              );
            })}
          </div>
          <p
            className={`text-sm text-white cursor-pointer ${
              isExtendContent ? "hidden" : ""
            } font-semibold underline`}
            onClick={() => setExtendContent(true)}
          >
            More...
          </p>
          <p
            className={`text-sm text-white cursor-pointer ${
              !isExtendContent ? "hidden" : ""
            } font-semibold underline`}
            onClick={() => setExtendContent(false)}
          >
            Collapse...
          </p>
        </div>
        <div className="absolute top-[10%] left-[33%] w-[30vw]">
          <div className="flex w-full items-center">
            <div className="flex gap-1 justify-between w-[90%]">
              <div className="flex gap">
                <img
                  draggable={false}
                  className="h-8 w-8 rounded-full"
                  src={stories?.user?.userInfo?.avatar}
                />
                <div className="ml-3 flex flex-col gap-1">
                  <p className="text-sm font-semibold antialiased block leading-tight text-white">
                    {stories?.user?.fullName}
                  </p>
                  <p className="text-sm antialiased block leading-tight text-white">
                    {stories?.createdDate}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {/* {stories && !stories[currentStoryIndex].type ? (
                  videoControl.play ? (
                    <BsPause
                      className="w-6 h-6 text-white cursor-pointer"
                      onClick={() => {
                        setVideoControl({
                          ...videoControl,
                          play: !videoControl.play,
                        });
                      }}
                    />
                  ) : (
                    <BsPlay
                      className="w-6 h-6 text-white cursor-pointer"
                      onClick={() => {
                        setVideoControl({
                          ...videoControl,
                          play: !videoControl.play,
                        });
                      }}
                    />
                  )
                ) : (
                  ""
                )} */}

                {stories && !stories.postImg[currentStoryIndex].type ? (
                  videoControl.muted ? (
                    <GoMute
                      className="w-6 h-6 text-white cursor-pointer"
                      onClick={() =>
                        setVideoControl({
                          ...videoControl,
                          muted: !videoControl.muted,
                        })
                      }
                    />
                  ) : (
                    <GoUnmute
                      className="w-6 h-6 text-white cursor-pointer"
                      onClick={() =>
                        setVideoControl({
                          ...videoControl,
                          muted: !videoControl.muted,
                        })
                      }
                    />
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`flex absolute top-[7%] w-[30vw] gap-2 px-2`}>
          {stories?.postImg?.map((item, index) => {
            return (
              <ProgressBar
                key={index}
                index={index}
                activeIndex={activeIndex}
                duration={nextStoryDuration}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
