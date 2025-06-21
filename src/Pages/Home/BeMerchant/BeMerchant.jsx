import React from "react";
import locationMerchant from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div data-aos="zoom-in-up" className="my-20 max-w-4xl mx-auto">
      <div className="py-16 px-10 bg-[#03373D] bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[top_center] bg-[length:1050px_auto] rounded-3xl flex flex-col md:flex-row gap-8 md:gap-4 items-center text-white">
        <div className="space-y-5">
          <h1 className="text-2xl md:text-3xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="max-w-2xl text-sm my-6 font-light">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="mt-8 flex gap-4 justify-center sm:justify-start flex-col sm:flex-row">
            <button className="btn bg-primary hover:bg-transparent border-primary text-black hover:text-primary rounded-full shadow-none">
              Become a Merchant
            </button>
            <button className="btn btn-primary hover:text-black shadow-none btn-outline rounded-full">
              Earn with Profast Courier
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img src={locationMerchant} alt="" className="w-[70%] md:w-full" />
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
