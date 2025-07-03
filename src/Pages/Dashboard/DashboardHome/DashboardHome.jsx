import React from "react";
import useUserRole from "../../../Hooks/useUserRole";
import Forbidden from "../../Forbidden/Forbidden";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";
import Loading from "../../../Components/Loading/Loading";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else if (role === "user") {
    return <UserDashboard></UserDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default DashboardHome;
