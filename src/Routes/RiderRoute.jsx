import React from "react";
import useAuth from "../Hooks/useAuth";
import loader from "../assets/animations/loading.json";
import useUserRole from "../Hooks/useUserRole";
import { Navigate } from "react-router";
import Lottie from "lottie-react";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return (
      <Lottie
        animationData={loader}
        loop={true}
        className="h-[40vh] w-auto"
      ></Lottie>
    );
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden"></Navigate>;
  }

  return children;
};

export default RiderRoute;
