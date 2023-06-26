import React, { useEffect } from "react";
import UserDetail from "../../components/profileComponent/UserDetail";
import UserPostContainer from "../../components/profileComponent/UserPostContainer";

export default function Profile() {

  return (
    <>
      <div className="w-100 flex flex-col items-center justify-center mx-10">
        <div>
          <UserDetail />
        </div>
        <div className="w-full">
          <UserPostContainer />
        </div>
      </div>
    </>
  );
}
