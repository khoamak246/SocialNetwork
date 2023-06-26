import React, { useState } from "react";
import { useEffect } from "react";

export default function ProgressBar({ index, activeIndex, duration }) {
  const [progress, setProgress] = useState(0);
  const isActive = index === activeIndex;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        }
        clearInterval(intervalId);
        return prevProgress;
      });
    }, duration / 100);
    return () => clearInterval(intervalId);
  }, [duration, activeIndex]);

  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);

  return (
    <div
      className={`w-full h-[4px] bg-[#80786F] rounded overflow-hidden transition-opacity duration-300 ease-out opacity-100`}
    >
      <div
        className={`${isActive ? "h-full bg-white rounded" : ""}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
