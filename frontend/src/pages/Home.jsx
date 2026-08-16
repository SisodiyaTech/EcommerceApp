import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FilterData from "../components/FilterData";
import SearchProducts from "../components/SearchProducts";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <FilterData />
      <SearchProducts />
      <Footer />
    </div>
  );
};

export default Home;
