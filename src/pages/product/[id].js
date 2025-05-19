import CoffeeShopHeader from "@/components/HomePage/Header";
import ProductDetail from "@/components/ProductPage/ProductDetail";
import { useState } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/HomePage/Footer";
import CoffeeLoader from "@/components/UI/CoffeeLoader";

export default function Product() {
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;
  console.log("id = " + id);

  return (
    <>
      {isLoading && <CoffeeLoader />}
      <CoffeeShopHeader onSelectAddress={setSelectedAddress} />

      <ProductDetail productId={id} setIsLoading={setIsLoading}></ProductDetail>
      <Footer />
    </>
  );
}
