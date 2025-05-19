import CoffeeShopCarousel from "@/components/HomePage/PopularDishesCarousel";
import CoffeeShopHeader from "@/components/HomePage/Header";
import MainInfo from "@/components/HomePage/MainInfo";
import DogPolicies from "@/components/HomePage/DogFriendly";
import Footer from "@/components/HomePage/Footer";
import GreatCoffee from "@/components/HomePage/GreatCoffee";
import Lunch from "@/components/HomePage/Lunch";
import Deserts from "@/components/HomePage/Deserts";
import BannerCarousel from "@/components/HomePage/BannerCarousel";


export default function Home() {
  return (
    <>
      <CoffeeShopHeader />
      <BannerCarousel/>
      <CoffeeShopCarousel />
      <DogPolicies />
      <GreatCoffee />
      <Lunch />
      <Deserts />
      <Footer />
    </>
  );
}
