import React from "react";
import liveTracking from "../../../assets/live-tracking.png";
import delivery from "../../../assets/tiny-deliveryman.png";
import support from "../../../assets/safe-delivery.png";

const featuresData = [
  {
    image: liveTracking,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
  },
  {
    image: delivery,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    image: support,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
  },
];

const Features = () => {
  return (
    <div data-aos="fade-right" className="py-12 my-20 max-w-4xl mx-auto border-y-2 border-dashed border-[#03464D]">
      <div className="grid gap-6 grid-cols-1">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center gap-4 bg-white p-6 rounded-lg"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-28 sm:w-40 h-auto mr-4"
            />
            <div className="h-full flex flex-col gap-4 justify-center text-center sm:text-left p-6 border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-[#03464D]">
              <h3 className="text-lg font-bold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
