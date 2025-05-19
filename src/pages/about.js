import AboutLayout from "@/components/AboutPage/AboutLayout";
import TableMap from "@/components/AboutPage/VirtualRestaurantMap";
import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from "@/components/HomePage/Header";
import MapComponent from "@/components/MapPage/MapComponent";
import MapWrapper from "@/components/MapPage/MapWrapper";




export default function AboutPage() {
  return (
    <>
    <CoffeeShopHeader/>
      <AboutLayout/>
      <Footer/>
    </>
  );
}
