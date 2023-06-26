import React from "react";
import { emptyProfile } from "../../assets/js/emptyProfile/EmptyProfile";
import { useState } from "react";
import { useEffect } from "react";
export default function EmptyPost({ tab }) {
  const [displayTab, setDisplayTab] = useState();
  useEffect(() => {
    emptyProfile.forEach((val) => {
      if (val.tab === tab) {
        return setDisplayTab(val);
      }
    });
  }, [tab]);

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="flex flex-col justify-center items-center">
        <div className="w-[20%]">
          <img
            src={`${displayTab?.url}`}
            alt=""
            className="w-full"
            draggable={false}
          />
        </div>
        <div>
          <p className="text-3xl font-bold">{displayTab?.title}</p>
        </div>
        <div>
          <p>{displayTab?.content}</p>
        </div>
      </div>
    </div>
  );
}
