import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from "@/components/HomePage/Header";
import MapComponent from "@/components/MapPage/MapComponent";
import CoffeeLoader from "@/components/UI/CoffeeLoader";
import { useState } from "react";

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <CoffeeLoader />}
      <CoffeeShopHeader />
      <MapComponent setIsLoading={setIsLoading} />
      <Footer />
    </>
  );
}
