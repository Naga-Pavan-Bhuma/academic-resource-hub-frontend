// src/pages/Home.jsx
import React from "react";
import NavbarLoggedIn from "../sections/NavbarLoggedIn";
import StudentHero from "../sections/StudentHero";
import RecentResources from "../sections/RecentResources";
import CallToAction from "../sections/CallToAction";
import Footer from "../sections/Footer";
import TopScorers from "../sections/TopScorers";
import StudentStats from "../sections/StudentStats";
const Home = ({ user }) => {
  return (
    <>
      <NavbarLoggedIn userName={user.name} profileImg={user.profileImg} />
      <StudentHero user={user} />
      <RecentResources year={user.year} branch={user.branch} userId={user._id} />
      <TopScorers user={user} />
      <StudentStats />
      <Footer />
    </>
  );
};
export default Home;
