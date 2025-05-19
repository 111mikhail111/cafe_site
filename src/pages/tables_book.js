import TableMap from "@/components/AboutPage/VirtualRestaurantMap";
import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from '../components/HomePage/Header'
import CoffeeLoader from "@/components/UI/CoffeeLoader";
import { useState } from "react";


export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
    {isLoading && <CoffeeLoader />}
      <CoffeeShopHeader/>
      <TableMap setIsLoadingProp={setIsLoading}/>
      <Footer/>
    </>
  );
}
