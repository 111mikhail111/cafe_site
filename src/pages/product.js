import Footer from "@/components/HomePage/Footer";
import CoffeeShopHeader from "@/components/HomePage/Header";
import ProductDetail from "@/components/ProductPage/ProductDetail";
import CoffeeLoader from "@/components/UI/CoffeeLoader";
import { useState } from "react";

export default function Product() {
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>{isLoading && <CoffeeLoader />}
      <CoffeeShopHeader onSelectAddress={setSelectedAddress} />
      <ProductDetail setIsLoading={setIsLoading}></ProductDetail>
      <Footer/>
    </>
  );
}
