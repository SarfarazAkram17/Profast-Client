import React, { useRef } from "react";
import boxes from "../../../assets/customer-top.png";
import quotes from "../../../assets/reviewQuote.png";

import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { FiArrowRight, FiArrowLeft } from "react-icons/fi";

const testimonialsData = [
  {
    name: "Afsana Rahman",
    title: "Online Shop Owner",
    review:
      "This courier service has truly transformed how I manage deliveries. Always fast, safe, and efficient — a must-have for small business owners growing in today's market.",
    avatarColor: "bg-[#003844]",
  },
  {
    name: "Sajid Islam",
    title: "Freelancer",
    review:
      "Sending documents has never been easier. Their seamless system and great customer support save me so much time and hassle — a truly dependable and smooth experience overall.",
    avatarColor: "bg-[#005B7F]",
  },
  {
    name: "Tanvir Hasan",
    title: "eCommerce Seller",
    review:
      "Their automatic order sync is amazing. It keeps my shipping smooth and helps my online store look more professional. A reliable solution that meets every delivery need.",
    avatarColor: "bg-[#2A3132]",
  },
  {
    name: "Farzana Karim",
    title: "Fashion Brand Owner",
    review:
      "Everything from pick-up to delivery is handled with care. It reflects positively on my brand and keeps my customers happy with each order — consistency that I can trust.",
    avatarColor: "bg-[#FFB400]",
  },
  {
    name: "Zahidul Kabir",
    title: "Corporate Client",
    review:
      "We’ve relied on this service for important documents and they’ve never let us down. Secure, prompt, and very professional — they understand corporate delivery demands.",
    avatarColor: "bg-[#6C5B7B]",
  },
  {
    name: "Sadia Jahan",
    title: "Social Media Seller",
    review:
      "Their home pickup and cash-on-delivery features are a huge plus for sellers like me using Instagram and Facebook daily. Easy, fast, and perfect for growing online stores.",
    avatarColor: "bg-[#A7C5BD]",
  },
  {
    name: "Rahim Uddin",
    title: "Tech Product Reseller",
    review:
      "I’ve shipped countless gadgets with them and every delivery has been safe, well-tracked, and on time — highly recommended for anyone handling sensitive or fragile items.",
    avatarColor: "bg-[#C94C4C]",
  },
  {
    name: "Imran Mahmud",
    title: "Logistics Manager",
    review:
      "For handling bulk shipments, they’re top-notch. We trust them for consistent, affordable service that meets deadlines and provides real-time updates every step of the way.",
    avatarColor: "bg-[#336B87]",
  },
  {
    name: "Tania Chowdhury",
    title: "Home Baker",
    review:
      "Timely delivery and perfect package handling help my cakes arrive fresh. Customers are happy, and I’m stress-free knowing my items are in reliable, professional hands.",
    avatarColor: "bg-[#7A9E9F]",
  },
  {
    name: "Hasib Hossain",
    title: "Startup Founder",
    review:
      "As a startup, we need reliable partners. This courier service gives us the confidence to scale with fast, affordable logistics support — exactly what we needed to grow.",
    avatarColor: "bg-[#3B3A30]",
  },
  {
    name: "Hasib Hossain",
    title: "Startup Founder",
    review:
      "As a startup, we need reliable partners. This courier service gives us the confidence to scale with fast, affordable logistics support — exactly what we needed to grow.",
    avatarColor: "bg-[#3B3A30]",
  },
];

const Testimonials = () => {
  const swiperRef = useRef(null);

  return (
    <section data-aos='zoom-in-up' className="my-10 text-center px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={boxes} alt="Box Icon" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#003844] mb-4">
          What our customers are saying
        </h2>
        <p className="text-sm text-gray-600 mb-10">
          Delivering trust and reliability — hear how our customers use our
          courier service to streamline personal and business deliveries.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 50,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination-dots",
          }}
          modules={[EffectCoverflow, Pagination]}
        >
          {testimonialsData.map((item, index) => (
            <SwiperSlide key={index} className="max-w-md mx-auto">
              <div className="bg-white p-8 pb-12 rounded-3xl shadow-md space-y-4">
                <img src={quotes} alt="Quote" />
                <p className="text-sm text-gray-700 pb-4 border-b-2 border-dashed border-gray-300">
                  {item.review}
                </p>
                <div className="flex gap-4 items-center">
                  <div
                    className={`w-12 h-12 rounded-full ${item.avatarColor}`}
                  />
                  <div>
                    <h3 className="font-bold text-[#03464D]">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.title}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-6 flex items-center gap-6 justify-center">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-2 rounded-full bg-white text-black hover:bg-primary"
            aria-label="Previous testimonial"
          >
            <FiArrowLeft size={20} />
          </button>

          <div className="flex justify-center max-w-auto">
            <div className="custom-pagination-dots flex gap-2" />
          </div>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-2 rounded-full bg-white text-black hover:bg-primary"
            aria-label="Next testimonial"
          >
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
