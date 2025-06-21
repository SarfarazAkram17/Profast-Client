import React from "react";
import Marquee from "react-fast-marquee";
import casio from "../../../assets/brands/casio.png";
import amazon from "../../../assets/brands/amazon.png";
import moonstar from "../../../assets/brands/moonstar.png";
import start from "../../../assets/brands/start.png";
import startPeople from "../../../assets/brands/start-people 1.png";
import randstad from "../../../assets/brands/randstad.png";

const ClientLogosMarquee = () => {
  const clientLogos = [casio, amazon, moonstar, start, startPeople, randstad];

  return (
    <div className="my-20 max-w-4xl mx-auto">
      <h3 className="text-center font-bold text-[#03373D] mb-8 text-lg">
        We've helped thousands of sales teams
      </h3>
      <Marquee pauseOnHover={true} speed={60}>
        {clientLogos.map((clientLogo, index) => (
          <div key={index} className="mx-8">
            <img src={clientLogo} alt="" className="h-5 w-auto" />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ClientLogosMarquee;
