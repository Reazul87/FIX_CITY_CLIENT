import React from "react";
import Banner from "../../Components/Banner/Banner";
import LatestResolvedIssues from "../../Components/LatestResolvedIssues/LatestResolvedIssues";
import Features from "../../Components/Features/Features";
import HowItWorks from "../../Components/HowItWorks/HowItWorks";
import Testimonials from "../../Components/Testimonials/Testimonials";
import FAQ from "../../Components/FAQ/FAQ";
import Team from "../../Components/Team/Team";
import BlogNews from "../../Components/BlogNews/BlogNews";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <LatestResolvedIssues></LatestResolvedIssues>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <Testimonials />
      <FAQ></FAQ>
      <Team></Team>
      <BlogNews></BlogNews>
    </div>
  );
};

export default Home;
