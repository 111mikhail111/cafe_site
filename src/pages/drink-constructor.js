import DrinkConstructor from "@/components/DrinkConstructorPage/DrinkConstructor";
import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from "@/components/HomePage/Header";
import CoffeeLoader from "@/components/UI/CoffeeLoader";
import { useState } from "react";

export default function DrinkConstructorPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <CoffeeLoader />}

      <CoffeeShopHeader />
      <DrinkConstructor setIsLoading={setIsLoading} />
      <Footer />
    </>
  );
}
