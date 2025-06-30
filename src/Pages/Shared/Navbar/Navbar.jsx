import React from "react";
import { Link, NavLink } from "react-router";
import ProfastLogo from "../ProfastLogo/ProfastLogo";
import { RxArrowTopRight } from "react-icons/rx";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logOutUser } = useAuth();

  const navItems = (
    <>
      <NavLink className="px-4 py-1 font-semibold rounded-full text-xs" to="/">
        Home
      </NavLink>
      <NavLink
        className="px-4 py-1 font-semibold rounded-full text-xs"
        to="/aboutUs"
      >
        About Us
      </NavLink>

      {user && (
        <NavLink
          className="px-4 py-1 font-semibold rounded-full text-xs"
          to="/dashboard"
        >
          Dashboard
        </NavLink>
      )}

      <NavLink
        className="px-4 py-1 font-semibold rounded-full text-xs"
        to="/sendParcel"
      >
        Send Parcel
      </NavLink>
      <NavLink
        className="px-4 py-1 font-semibold rounded-full text-xs"
        to="/coverage"
      >
        Coverage
      </NavLink>
    </>
  );

  const logOut = () => {
    logOutUser()
      .then(() => toast.warn("You logged out successfully"))
      .catch((error) => toast.error(error.message));
  };
  return (
    <div className="navbar bg-base-100 px-4 rounded-xl py-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-6 space-y-1 w-48 p-4 shadow-lg text-center"
          >
            {navItems}
            {user && (
              <button
                onClick={logOut}
                className="btn btn-error mb-2 font-bold btn-sm"
              >
                Logout
              </button>
            )}
            <Link to="/beARider">
              {" "}
              <button className="btn bg-primary border-2 w-full rounded-lg btn-sm font-bold hover:bg-transparent border-primary text-black shadow-none">
                Be a rider <RxArrowTopRight size={18} />
              </button>
            </Link>
          </ul>
        </div>

        <div className="ml-4">
          <ProfastLogo></ProfastLogo>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <img
              src={user.photoURL}
              alt="Profile Picture"
              className="h-11 w-11 rounded-full mr-2"
            />
            <button
              onClick={logOut}
              className="btn btn-sm hidden lg:block font-bold btn-error mr-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            {" "}
            <button className="btn btn-sm btn-primary border-2 rounded-lg font-bold text-black shadow-none btn-outline mr-2">
              Login
            </button>
          </Link>
        )}
        <Link to="/beARider">
          {" "}
          <button className="btn btn-sm hidden lg:flex bg-primary border-2 rounded-lg font-bold hover:bg-transparent border-primary text-black shadow-none">
            Be a rider <RxArrowTopRight size={18} className="-ml-2" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
