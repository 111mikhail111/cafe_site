import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./CardsSet.module.css";
import { useRouter } from "next/router";
import Link from "next/link"; // Import the Link component
import UiLoader from "../UI/UiLoader";
import { useCart } from "@/lib/CartContext";
import ProductCard from "../UI/ProductCard";
import { useAddresses } from "@/lib/AddressContext";

export default function CardsSet({ selectedKind, setIsLoadingProp }) {
  const [products, setProducts] = useState([]); // Состояние для продуктов
  const [isLoading, setIsLoading] = useState(false);
  const {selectedAddress} = useAddresses();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsLoadingProp(false);
      }, 500); // 2000 миллисекунд = 2 секунды

      // Очищаем таймер при размонтировании компонента
      return () => clearTimeout(timer);
    }
    if (isLoading) {
      setIsLoadingProp(true);
    }
  }, [isLoading, setIsLoadingProp]);

  useEffect(() => {
    console.log("Selected Kind:", selectedKind);
    console.log("Selected Address:", selectedAddress);

    if (selectedKind && selectedAddress) {
      setIsLoading(true);
      fetch(
        `/api/getproducts?kindId=${selectedKind.id}&cafeId=${selectedAddress}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.message);
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке продуктов:", error);
          setIsLoading(false);
        });
    } else {
      setProducts([]); // Сбросить продукты, если нет выбранного вида или адреса
    }
  }, [selectedKind, selectedAddress]);

  return (
    <div className={styles.csContainer}>
      <h2 className={styles.csTitle}>Меню</h2>
      <div className={styles.csGrid}>
        {isLoading ? (
          <UiLoader />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product}/>
          ))
        )}
      </div>
    </div>
  );
}
