import React from "react";
import useAuth from "../Hooks/useAuth";
import loader from "../assets/animations/loading.json";
import useUserRole from "../Hooks/useUserRole";
import { Navigate, useLocation } from "react-router";
import Lottie from "lottie-react";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <Lottie
        animationData={loader}
        loop={true}
        className="h-[40vh] w-auto"
      ></Lottie>
    );
  }

  if (!user || role !== "admin") {
    return <Navigate state={location.pathname} to="/forbidden"></Navigate>;
  }

  return children;
};

export default AdminRoute;
