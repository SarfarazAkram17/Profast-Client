import React from "react";
import {
  FaBoxes,
  FaWarehouse,
  FaUndoAlt,
} from "react-icons/fa";
import { FaTruckFast, FaHandHoldingDollar } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import ServiceCard from "../../Shared/ServiceCard/ServiceCard";

const servicesData = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: FaTruckFast,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: GrMapLocation,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: FaBoxes,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: FaHandHoldingDollar,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: FaWarehouse,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: FaUndoAlt,
  },
];

const Services = () => {
  return (
    <div className="py-16 bg-[#093437] text-white my-20 rounded-3xl">
      <div className="container mx-auto px-4 sm:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-center mb-10 max-w-2xl mx-auto text-gray-300">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
