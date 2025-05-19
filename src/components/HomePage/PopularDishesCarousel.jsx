import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./PopularDishesCarousel.module.css";
import { useCart } from "@/lib/CartContext";
import ProductCard from "../UI/ProductCard";

const mockproducts = [
  {
    id: 1,
    name: "Espresso",
    description:
      "A bold and concentrated form of coffee served in a small cup.",
    price: "$3.50",
    imageUrl:
      "https://avatars.mds.yandex.net/i?id=6468caed82a352986b4398dd250874de_l-12884984-images-thumbs&n=13",
  },
  {
    id: 2,
    name: "Latte",
    description: "A smooth and creamy coffee drink with velvety microfoam.",
    price: "$4.50",
    imageUrl:
      "https://kartinki.pics/uploads/posts/2022-06/1654634409_36-kartinkin-net-p-kartinki-latte-44.jpg",
  },
  {
    id: 3,
    name: "Cappuccino",
    description: "Perfectly balanced mix of espresso and steamed milk.",
    price: "$4.00",
    imageUrl:
      "https://avatars.mds.yandex.net/i?id=e0d55471c0ba67adfd8d60507c0f4a98_l-5275502-images-thumbs&n=13",
  },
  {
    id: 4,
    name: "Americano",
    description: "Rich espresso diluted with hot water for a longer drink.",
    price: "$3.00",
    imageUrl: "https://kolyda.ru/d/kofe_amerikano.jpg",
  },
  {
    id: 5,
    name: "Mocha",
    description:
      "Espresso with chocolate syrup and steamed milk, topped with whipped cream.",
    price: "$5.00",
    imageUrl:
      "https://sun9-41.userapi.com/impg/wCv8XDlHEfwUiK8qMr375Qs_nFGIVtjW9T4cJg/7bKlHqfW7t4.jpg?size=807x637&quality=96&sign=f94762717b845573f268e971762ca750&c_uniq_tag=9Ca0IWong3F4E1fq9MrlBnV1LRbNL8rupWVPncmqwM8&type=album",
  },
  {
    id: 6,
    name: "Flat White",
    description:
      "Strong espresso with velvety steamed milk and thin microfoam.",
    price: "$4.50",
    imageUrl:
      "https://coffeepedia.ru/wp-content/uploads/2019/01/flat-white.jpg",
  },
  {
    id: 7,
    name: "Macchiato",
    description: 'Espresso "stained" with a small amount of steamed milk.',
    price: "$3.75",
    imageUrl:
      "https://coffeepedia.ru/wp-content/uploads/2013/01/coffee-macchiato.jpg",
  },
];

export default function CoffeeShopCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [dbProducts, setDbProducts] = useState(null);
  const trackRef = useRef(null);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    fetch("/api/products/get_popular")
      .then((response) => response.json())
      .then((data) => {
        setDbProducts(data);
        console.log(data);
      });
  }, []);

  const products = dbProducts || mockproducts;

  // Клонируем первые и последние карточки для бесшовной анимации
  const clonedProducts = [
    ...products.slice(-visibleCards),
    ...products,
    ...products.slice(0, visibleCards),
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [visibleCards]);

  // Обработчик для следующего слайда
  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      // Если достигли конца оригинальных карточек, плавно переходим к началу
      if (newIndex >= products.length) {
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = "none";
            setCurrentIndex(0);
            setTimeout(() => {
              if (trackRef.current) {
                trackRef.current.style.transition =
                  "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
              }
            }, 50);
          }
        }, 600);
        return newIndex;
      }
      return newIndex;
    });
  };

  // Обработчик для предыдущего слайда
  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      // Если достигли начала оригинальных карточек, плавно переходим к концу
      if (newIndex < 0) {
        setTimeout(() => {
          if (trackRef.current) {
            trackRef.current.style.transition = "none";
            setCurrentIndex(products.length - 1);
            setTimeout(() => {
              if (trackRef.current) {
                trackRef.current.style.transition =
                  "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
              }
            }, 50);
          }
        }, 600);
        return newIndex;
      }
      return newIndex;
    });
  };

  // Рассчитываем смещение для track
  const getOffset = () => {
    const cardWidth = 100 / visibleCards;
    return `translateX(calc(-${(currentIndex + visibleCards) * cardWidth}% - ${
      (currentIndex + visibleCards) * 1
    }rem))`;
  };

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.carouselTitle}>Популярные товары</h2>
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          <div
            ref={trackRef}
            className={styles.carouselTrack}
            style={{
              transform: getOffset(),
              gap: "1rem",
            }}
          >
            {clonedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className={styles.carouselItem}
                style={{
                  minWidth: `calc(${100 / visibleCards}% - 1rem)`,
                  flex: `0 0 calc(${100 / visibleCards}% - 1rem)`,
                }}
              >
                <ProductCard product={product}/>
              </div>
            ))}
          </div>
        </div>
        <button
          className={`${styles.carouselButton} ${styles.prev}`}
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <ArrowLeft className={styles.carouselIcon} />
        </button>
        <button
          className={`${styles.carouselButton} ${styles.next}`}
          onClick={handleNext}
          aria-label="Next slide"
        >
          <ArrowRight className={styles.carouselIcon} />
        </button>
      </div>
      <div className={styles.dotsContainer}>
        {products.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === currentIndex % products.length ? styles.activeDot : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
