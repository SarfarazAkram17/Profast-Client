import Lottie from "lottie-react";
import React from "react";
import { Outlet, useLocation } from "react-router";
import loginLottie from "../assets/animations/login.json";
import registerLottie from "../assets/animations/register.json";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="xl:container mx-auto px-3 md:px-8 py-5 bg-[#FAFDF0] flex flex-col sm:flex-row justify-center items-center">
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <div className="flex-1">
        {location.pathname === "/login" && (
          <Lottie loop={true} animationData={loginLottie}></Lottie>
        )}
        {location.pathname === "/register" && (
          <Lottie loop={true} animationData={registerLottie}></Lottie>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
