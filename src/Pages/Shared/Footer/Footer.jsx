import React from "react";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router";
import ProfastLogo from "../ProfastLogo/ProfastLogo";

const Footer = () => {
  const navItems = (
    <>
      <NavLink className="px-4 py-1 font-semibold rounded-full" to="/">
        Home
      </NavLink>
      <NavLink className="px-4 py-1 font-semibold rounded-full" to="/aboutUs">
        About Us
      </NavLink>
      <NavLink className="px-4 py-1 font-semibold rounded-full" to="/services">
        Services
      </NavLink>
      <NavLink className="px-4 py-1 font-semibold rounded-full" to="/coverage">
        Coverage
      </NavLink>
      <NavLink className="px-4 py-1 font-semibold rounded-full" to="/pricing">
        Pricing
      </NavLink>
    </>
  );

  return (
    <footer className="footer footer-horizontal footer-center bg-[#0B0B0B] text-white rounded-2xl p-10">
      <aside>
        <ProfastLogo></ProfastLogo>
        <p className="font-light max-w-2xl mx-auto mt-4 text-xs leading-5">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </aside>

      <nav className="-mt-3 border-y-2 border-dashed w-full py-2 border-[#03464D]">
        <ul className="menu menu-horizontal gap-2">{navItems}</ul>
      </nav>
      <nav className="-mt-3">
        <div className="grid grid-flow-col gap-4">
          <a href="https://www.linkedin.com" target="_blank">
            <FaLinkedin size={25} className="text-[#1781B9]" />
          </a>
          <a href="https://x.com" target="_blank">
            <FaXTwitter
              size={25}
              className="bg-white rounded-full text-black p-1"
            />
          </a>
          <a href="https://www.facebook.com" target="_blank">
            <FaFacebook
              size={25}
              className="text-[#0093FF] bg-white rounded-full"
            />
          </a>
          <a href="https://www.youtube.com" target="_blank">
            <FaYoutube
              size={25}
              className="bg-[#FF0000] text-white rounded-full p-1"
            />
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
