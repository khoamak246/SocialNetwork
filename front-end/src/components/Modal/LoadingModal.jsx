import React from "react";

export default function LoadingModal({ isToggle }) {
  return (
    <div
      className={`${
        isToggle ? "z-50 bg-opacity-30 bg-white" : "z-0 bg-opacity-100"
      } fixed w-full h-full backdrop-blur-sm flex justify-center items-center  duration-200 transition-all`}
    >
      <div>
        <img
          className={`${
            isToggle ? "opacity-100" : "opacity-0"
          } w-[80%] duration-300 transition-all`}
          src="https://firebasestorage.googleapis.com/v0/b/insta-fullstack.appspot.com/o/load-1110_256.gif?alt=media&token=56a65fa0-8518-43c2-82b0-245c912f8990&_gl=1*uea041*_ga*OTg5NTExNTUxLjE2ODYzMjQzMDE.*_ga_CW55HF8NVT*MTY4NjQ1MTQzMy42LjEuMTY4NjQ1MjE3Mi4wLjAuMA.."
          alt=""
          draggable={false}
        />
      </div>
    </div>
  );
}
