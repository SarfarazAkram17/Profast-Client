import React from "react";
import { FaBuilding, FaMapMarkerAlt, FaTruckMoving } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";

const steps = [
  {
    title: "Booking Pick & Drop",
    icon: <FaTruckMoving className="text-4xl text-gray-600" />,
    desc: "Easily schedule pickups and drops for your packages from your doorstep or office.",
  },
  {
    title: "Cash On Delivery",
    icon: <FaHandHoldingDollar className="text-4xl text-gray-600" />,
    desc: "Pay when your package is delivered — convenient and secure for all customers.",
  },
  {
    title: "Delivery Hub",
    icon: <FaMapMarkerAlt className="text-4xl text-gray-600" />,
    desc: "Drop off or collect parcels from our nearby delivery hubs across the city.",
  },
  {
    title: "Booking SME & Corporate",
    icon: <FaBuilding className="text-4xl text-gray-600" />,
    desc: "Customized delivery solutions for businesses, SMEs, and corporate logistics needs.",
  },
];

const HowItWorks = () => {
  return (
    <section data-aos='zoom-in-up' className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8">
          How it Works
        </h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500"
            >
              {step.icon}
              <h3 className="font-bold md:text-lg mt-4 mb-2 text-gray-800">{step.title}</h3>
              <p className="text-xs text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
