"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./DrinkConstructor.module.css";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import useDrinkComponents from "./useDrinkComponents";
import { useCart } from "@/lib/CartContext";
import CoffeeLoader from "../UI/CoffeeLoader";

const DrinkConstructor = ({ setIsLoading }) => {
  const { components, loading, error } = useDrinkComponents();
  const { addToCart } = useCart();

  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedAdditive, setSelectedAdditive] = useState(null);
  const [selectedTopping, setSelectedTopping] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const baseRef = useRef(null);
  const additiveRef = useRef(null);
  const toppingRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (!loading && components.bases?.length > 0) {
      setSelectedBase(components.bases[0]);
      setSelectedAdditive(components.additives[0]);
      setSelectedTopping(components.toppings[0]);
    }
  }, [loading, components]);

  if (error) return <div>Error: {error}</div>;

  if (!selectedBase || !selectedAdditive || !selectedTopping) {
    return <div>Initializing drink constructor...</div>;
  }

  const { bases, additives, toppings } = components;

  const handleScroll = (ref, items, setSelected) => {
    const { scrollLeft, clientWidth } = ref.current;
    const itemWidth = clientWidth / 3;
    const selectedIndex = Math.round(scrollLeft / itemWidth);
    setSelected(items[Math.min(selectedIndex, items.length - 1)]);
  };

  const scrollToCenter = (ref, index) => {
    if (!ref.current) return;

    const itemWidth = ref.current.clientWidth / 3;
    ref.current.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });
  };

  const scrollLeft = (ref, items, setSelected) => {
    const currentIndex = items.findIndex(
      (item) =>
        item.id ===
        (ref === baseRef
          ? selectedBase
          : ref === additiveRef
          ? selectedAdditive
          : selectedTopping
        ).id
    );
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToCenter(ref, newIndex);
    setSelected(items[newIndex]);
  };

  const scrollRight = (ref, items, setSelected) => {
    const currentIndex = items.findIndex(
      (item) =>
        item.id ===
        (ref === baseRef
          ? selectedBase
          : ref === additiveRef
          ? selectedAdditive
          : selectedTopping
        ).id
    );
    const newIndex = Math.min(items.length - 1, currentIndex + 1);
    scrollToCenter(ref, newIndex);
    setSelected(items[newIndex]);
  };

  const handleOrder = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowResult(true);
      setIsAnimating(false);
    }, 1000);
  };

  const resetConstructor = () => {
    setShowResult(false);
    setSelectedBase(bases[0]);
    setSelectedAdditive(additives[0]);
    setSelectedTopping(toppings[0]);
    scrollToCenter(baseRef, 0);
    scrollToCenter(additiveRef, 0);
    scrollToCenter(toppingRef, 0);
  };

  const checkDrinkExists = async (name) => {
    try {
      const response = await fetch("/api/products/check-custom-drink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking drink:", error);
      return { exists: false };
    }
  };

  const loadProduct = async (productId) => {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    console.log("Загружаем продукт с таким id:", productId);

    try {
      const response = await fetch(`/api/getproductbyid?prodId=${productId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Дата в методе: ", data);

      

      return data;
    } catch (error) {
      console.error("Ошибка при загрузке продукта:", error);
      throw error;
    }
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  

  const saveCustomDrink = async (base, additive, topping) => {
    try {
      const productName = `Кастомный напиток: ${base.name} + ${additive.name} + ${topping.name}`;

      const { exists, product } = await checkDrinkExists(productName);

      if (exists) {
        await addToCart(product);
        resetConstructor();
        return product.id;
      }

      const productResponse = await fetch("/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          description: `Основа: ${base.name}, Добавка: ${additive.name}, Топпинг: ${topping.name}`,
        }),
      });

      const response = await productResponse.json();
      const productData = response.product;

      await fetch("/api/product-composition/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          {
            product_id: productData.id,
            ingredient_id: base.ingredient_id,
            weight: 200,
          },
          {
            product_id: productData.id,
            ingredient_id: additive.ingredient_id,
            weight: 50,
          },
          {
            product_id: productData.id,
            ingredient_id: topping.ingredient_id,
            weight: 30,
          },
        ]),
      });

      const prod = await loadProduct(productData.id);
      console.log("Из метода получили это:", prod);

      await addToCart(prod);
      alert("Ваш напиток добавлен в заказ!");

      resetConstructor();
      return productData.id;
    } catch (error) {
      console.error("Error saving custom drink:", error);
      alert("Произошла ошибка при создании напитка");
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Создай свой уникальный напиток</h1>
        <p className={styles.subtitle}>
          Выбери ингредиенты и создай свой идеальный вкус
        </p>
      </div>

      {!showResult ? (
        <>
          <div className={styles.cupContainer}>
            <div
              className={`${styles.cup} ${
                isAnimating ? styles.animateCup : ""
              }`}
              style={{
                "--base-color": selectedBase.color,
                "--additive-color": selectedAdditive.color,
                "--topping-color": selectedTopping.color,
              }}
            >
              <div className={styles.topping}></div>
              <div className={styles.additive}></div>
              <div className={styles.base}></div>
            </div>
          </div>

          <div className={styles.selectorSection}>
            <div className={styles.sectionHeader}>
              <h3>Основа</h3>
              <div className={styles.navigationButtons}>
                <button
                  onClick={() => scrollLeft(baseRef, bases, setSelectedBase)}
                  disabled={selectedBase.id === bases[0].id}
                  className={styles.navButton}
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={() => scrollRight(baseRef, bases, setSelectedBase)}
                  disabled={selectedBase.id === bases[bases.length - 1].id}
                  className={styles.navButton}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className={styles.carouselContainer}>
              <div
                className={styles.carousel}
                ref={baseRef}
                onScroll={() => handleScroll(baseRef, bases, setSelectedBase)}
              >
                {bases.map((base) => (
                  <div
                    key={base.id}
                    className={`${styles.carouselItem} ${
                      selectedBase.id === base.id ? styles.selectedItem : ""
                    }`}
                    style={{
                      backgroundImage: `url(${base.image})`,
                    }}
                  >
                    <div className={styles.itemOverlay}>{base.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.selectorSection}>
            <div className={styles.sectionHeader}>
              <h3>Добавка</h3>
              <div className={styles.navigationButtons}>
                <button
                  onClick={() =>
                    scrollLeft(additiveRef, additives, setSelectedAdditive)
                  }
                  disabled={selectedAdditive.id === additives[0].id}
                  className={styles.navButton}
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={() =>
                    scrollRight(additiveRef, additives, setSelectedAdditive)
                  }
                  disabled={
                    selectedAdditive.id === additives[additives.length - 1].id
                  }
                  className={styles.navButton}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className={styles.carouselContainer}>
              <div
                className={styles.carousel}
                ref={additiveRef}
                onScroll={() =>
                  handleScroll(additiveRef, additives, setSelectedAdditive)
                }
              >
                {additives.map((base) => (
                  <div
                    key={base.id}
                    className={`${styles.carouselItem} ${
                      selectedAdditive.id === base.id ? styles.selectedItem : ""
                    }`}
                    style={{
                      backgroundImage: `url(${base.image})`,
                    }}
                  >
                    <div className={styles.itemOverlay}>{base.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.selectorSection}>
            <div className={styles.sectionHeader}>
              <h3>Топпинг</h3>
              <div className={styles.navigationButtons}>
                <button
                  onClick={() =>
                    scrollLeft(toppingRef, toppings, setSelectedTopping)
                  }
                  disabled={selectedTopping.id === toppings[0].id}
                  className={styles.navButton}
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={() =>
                    scrollRight(toppingRef, toppings, setSelectedTopping)
                  }
                  disabled={
                    selectedTopping.id === toppings[toppings.length - 1].id
                  }
                  className={styles.navButton}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
            <div className={styles.carouselContainer}>
              <div
                className={styles.carousel}
                ref={toppingRef}
                onScroll={() =>
                  handleScroll(toppingRef, toppings, setSelectedTopping)
                }
              >
                {toppings.map((base) => (
                  <div
                    key={base.id}
                    className={`${styles.carouselItem} ${
                      selectedTopping.id === base.id ? styles.selectedItem : ""
                    }`}
                    style={{
                      backgroundImage: `url(${base.image})`,
                    }}
                  >
                    <div className={styles.itemOverlay}>{base.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            className={styles.orderButton}
            onClick={handleOrder}
            disabled={isAnimating}
          >
            {isAnimating ? "Готовим..." : "Создать напиток"}
          </button>
        </>
      ) : (
        <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <h2 className={styles.resultTitle}>Ваш напиток готов!</h2>
            <p className={styles.resultSubtitle}>
              Наслаждайтесь уникальным вкусом
            </p>
          </div>

          <div className={styles.resultCup}>
            <div
              className={styles.cup}
              style={{
                "--base-color": selectedBase.color,
                "--additive-color": selectedAdditive.color,
                "--topping-color": selectedTopping.color,
              }}
            >
              <div className={styles.topping}></div>
              <div className={styles.additive}></div>
              <div className={styles.base}></div>
            </div>
          </div>

          <div className={styles.resultDescription}>
            <h3 className={styles.drinkName}>
              "{selectedBase.name} {selectedAdditive.name}"
            </h3>
            <p className={styles.ingredients}>
              Основа: <span>{selectedBase.name}</span>
              <br />
              Добавка: <span>{selectedAdditive.name}</span>
              <br />
              Топпинг: <span>{selectedTopping.name}</span>
            </p>
          </div>

          <div className={styles.resultActions}>
            <button
              className={styles.orderButton}
              onClick={() =>
                saveCustomDrink(selectedBase, selectedAdditive, selectedTopping)
              }
            >
              Заказать за 350₽
            </button>
            <button className={styles.resetButton} onClick={resetConstructor}>
              Создать новый
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkConstructor;
