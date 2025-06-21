import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;

  return (
    <div
      className="card bg-base-100 p-6 flex flex-col gap-5 items-center text-center rounded-lg 
      hover:bg-primary transition-all duration-500"
    >
      <div className="text-4xl text-primary">
        <Icon size={40} />
      </div>
      <h3 className="text-lg font-bold text-black">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
