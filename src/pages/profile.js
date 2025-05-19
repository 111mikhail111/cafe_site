import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from "@/components/HomePage/Header";
import Profile from "@/components/ProfilePage/ProfileInfo";
import CoffeeLoader from "@/components/UI/CoffeeLoader";
import { useState } from "react";

export default function ClientProfile() {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <>{isLoading && <CoffeeLoader />}
      <CoffeeShopHeader/>
      <Profile setIsLoading={setIsLoading}/>
      <Footer/>
    </>
  );
}
