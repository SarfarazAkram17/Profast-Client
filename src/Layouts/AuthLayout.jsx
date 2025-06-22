import React from "react";
import authImage from "../assets/authImage.png";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="xl:container mx-auto px-3 md:px-8 py-5 bg-[#FAFDF0] flex flex-col-reverse md:flex-row justify-center items-center">
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <div className="flex-1">
        <img src={authImage} alt="" className="w-full" />
      </div>
    </div>
  );
};

export default AuthLayout;
