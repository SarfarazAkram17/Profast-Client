import React from "react";
import { NavLink, Outlet } from "react-router";
import ProfastLogo from "../Pages/Shared/ProfastLogo/ProfastLogo";
import {
  FiPackage,
  FiCreditCard,
  FiMapPin,
  FiUser,
  FiHome,
} from "react-icons/fi";
import {
  FaMotorcycle,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
} from "react-icons/fa";
import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 font-bold px-2">Dashboard</div>
        </div>

        <div className="my-10">
          <Outlet></Outlet>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
          {/* Sidebar content here */}
          <ProfastLogo></ProfastLogo>
          <br />
          <li className="my-1">
            <NavLink to="/dashboard" end>
              <FiHome /> Home
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink to="/dashboard/myParcels">
              <FiPackage /> My Parcels
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink to="/dashboard/paymentHistory">
              <FiCreditCard /> Payment History
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink to="/dashboard/track">
              <FiMapPin /> Track a Package
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink to="/dashboard/updateProfile">
              <FiUser /> Update Profile
            </NavLink>
          </li>
          {!roleLoading && role === "admin" && (
            <>
              {" "}
              <li className="my-1">
                <NavLink to="/dashboard/activeRiders">
                  <FaUserCheck /> Active Riders
                </NavLink>
              </li>
              <li className="my-1">
                <NavLink to="/dashboard/pendingRiders">
                  <FaUserClock /> Pending Riders
                </NavLink>
              </li>
              <li className="my-1">
                <NavLink to="/dashboard/assignRider">
                  <FaMotorcycle /> Assign Rider
                </NavLink>
              </li>
              <li className="my-1">
                <NavLink to="/dashboard/makeAdmin">
                  <FaUserShield /> Make Admin
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
