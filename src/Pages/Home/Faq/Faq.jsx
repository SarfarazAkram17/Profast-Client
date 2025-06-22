import React, { useState } from "react";
import {
  FiDollarSign,
  FiMap,
  FiUserPlus,
  FiPackage,
  FiBell,
} from "react-icons/fi";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      icon: <FiDollarSign />,
      question: "How can I calculate the delivery price?",
      answer:
        "You can use our delivery calculator by selecting the origin, destination, parcel type, and weight. It instantly provides you with the pricing details.",
    },
    {
      icon: <FiMap />,
      question: "Can I track my parcel in real time?",
      answer:
        "Yes! ProFast allows you to track your parcel live using your tracking ID provided after dispatch.",
    },
    {
      icon: <FiUserPlus />,
      question: "How can I apply to become a ProFast rider?",
      answer:
        "Visit the 'Apply as Rider' page, complete the application form, and upload necessary documents. We'll review and contact you shortly.",
    },
    {
      icon: <FiPackage />,
      question: "Is delivery available in all 64 districts?",
      answer:
        "Absolutely! ProFast provides courier service to all 64 districts of Bangladesh — fast, reliable, and efficient.",
    },
    {
      icon: <FiBell />,
      question:
        "How will I be notified when my product is picked up or delivered?",
      answer:
        "You will receive real-time notifications via SMS and email when your product is picked up, in transit, and delivered.",
    },
  ];

  return (
    <div data-aos="fade-right" className="my-20 px-4 max-w-4xl mx-auto">
      <h1 className="mb-12 text-center text-3xl md:text-4xl font-bold">
        Frequently Asked Questions
      </h1>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`collapse collapse-arrow border-2 mb-4 py-2 rounded-xl transition-colors duration-300 ${
            activeIndex === index
              ? "bg-[#E6F2F3] border-[#067A87]"
              : "bg-white border-gray-300"
          }`}
          onClick={() => setActiveIndex(index)}
        >
          <input
            type="radio"
            name="faq-accordion"
            checked={activeIndex === index}
            onChange={() => setActiveIndex(index)}
          />
          <div className="collapse-title font-bold text-[#03373D] flex items-center gap-2">
            <span className="text-xl">{faq.icon}</span>
            {faq.question}
          </div>
          <div className="collapse-content text-sm text-[#606060]">
            <hr className="border-[#C3DFE2] mb-4 border-t-2" />
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
