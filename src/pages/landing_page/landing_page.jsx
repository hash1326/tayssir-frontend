import React from "react";
import Navbar from "../../components/landing_page/Navbar.jsx";
import Hero from "../../components/landing_page/Hero.jsx";
import About from "../../components/landing_page/about.jsx";
import Testimonials from "../../components/landing_page/Testimonials.jsx"
import FAQ from "../../components/landing_page/FAQ.jsx";
import Features from "../../components/landing_page/Features.jsx";
import HowItWorks from "../../components/landing_page/How_it_works.jsx";
import Footer from "../../components/landing_page/Footer.jsx";

function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default Home;
