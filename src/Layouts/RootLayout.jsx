import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
const RootLayout = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="max-w-7xl bg-[#EAECED] px-3 md:px-8 py-5 mx-auto">
      <Navbar></Navbar>
      <div className="my-10">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
