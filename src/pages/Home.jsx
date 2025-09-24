// src/pages/Home.jsx
import React from "react";
import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import WhyChooseUs from "../sections/WhyChooseUs";
import HowItWorks from "../sections/HowItWorks";
import CallToAction from "../sections/CallToAction";
import Footer from "../sections/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChooseUs/>
      <HowItWorks/>
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
