import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import ClientLogosMarquee from "../ClientLogosMarquee/ClientLogosMarquee";
import Features from "../Features/Features";
import BeMerchant from "../BeMerchant/BeMerchant";
import HowItWorks from "../HowItWorks/HowItWorks";
import Faq from "../Faq/Faq";
import Testimonials from "../Testimonials/Testimonials";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <Services></Services>
      <ClientLogosMarquee></ClientLogosMarquee>
      <Features></Features>
      <BeMerchant></BeMerchant>
      <Testimonials></Testimonials>
      <Faq></Faq>
    </div>
  );
};

export default Home;
