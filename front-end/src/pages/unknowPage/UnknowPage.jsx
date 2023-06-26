import React from "react";
import { Link } from "react-router-dom";

export default function UnknowPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="text-2xl font-semibold">OOP! Somethign went wrong!</p>
        <p className="text-lg">
          This page doesn't exist, please check the link again!
        </p>
        <div className="bg-[#4CB5F9] py-1 px-4 rounded-lg cursor-pointer hover:bg-[#70c4fc] duration-100 transition-all">
          <Link to={"/"} className="font-semibold text-white">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
