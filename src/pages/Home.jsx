// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import WhyChooseUs from "../sections/WhyChooseUs";
import HowItWorks from "../sections/HowItWorks";
import CallToAction from "../sections/CallToAction";
import Footer from "../sections/Footer";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (isLoggedIn) {
      navigate("/student/");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
