import CoffeeShopHeader from "@/components/HomePage/Header";
import CoffeeShopCarousel from "@/components/HomePage/PopularDishesCarousel";
import Categories from "@/components/MenuPage/Categories";
import CardsSet from "@/components/MenuPage/CardsSet";
import { useState } from "react";
import styles from "../components/MenuPage/Categories.module.css";
import Footer from "@/components/HomePage/Footer";
import { useAddresses } from "@/lib/AddressContext";
import CoffeeLoader from "@/components/UI/CoffeeLoader";

export default function Menu() {
  const [selectedKind, setSelectedKind] = useState(null);
  const { addresses, selectedAddress, setSelectedAddress } = useAddresses();
  const [isLoading, setIsLoading] = useState(true);

  const handleAddressChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedAddress(selectedValue);
  };
  return (
    <>
      {isLoading && <CoffeeLoader />}
      <CoffeeShopHeader />
      {/* Выбор адреса */}
      <div className={styles.addressSelectorContainer}>
        <div className={styles.addressSelector}>
          <select
            className={styles.addressSelect}
            value={selectedAddress || ""}
            onChange={handleAddressChange}
          >
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.address}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.menuPageContainer}>
        <Categories onSelectKind={setSelectedKind} />
        <CardsSet selectedKind={selectedKind} setIsLoadingProp={setIsLoading}/>
      </div>
      <CoffeeShopCarousel />
      <Footer />
    </>
  );
}
