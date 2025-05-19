import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import styles from "./ProductDetail.module.css";
import UiLoader from "../UI/UiLoader";
import { useCart } from "@/lib/CartContext";
import { AddToCartButton } from "../UI/ProductCard";

const ProductDetail = ({ productId, setIsLoading }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart, decreaseQuantity } = useCart();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2000 миллисекунд = 2 секунды

      // Очищаем таймер при размонтировании компонента
      return () => clearTimeout(timer);
    }
    if (loading) {
      setIsLoading(true);
    }
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2000 миллисекунд = 2 секунды
      
      // Очищаем таймер при размонтировании компонента
      return () => clearTimeout(timer);
    }
  }, [loading, setIsLoading]);
  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    fetch(`/api/getproductbyid?prodId=${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о продукте");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.error("Ошибка при загрузке продукта:", error);
      });
  }, [productId]);

  if (loading) return <UiLoader />;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!product) return <div className={styles.notFound}>Продукт не найден</div>;

  return (
    <div className={styles.container}>
      <div className={styles.left_panel}>
        <div className={styles.name}>{product.name}</div>
        {product.image && (
          <img
            className={styles.image}
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
      <div className={styles.right_panel}>
        <div className={styles.up}>{product.price}₽</div>
        <div className={styles.down}>
          <div className={styles.cardContent}>
            <ul className={styles.detailsList}>
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Вид:</span>
                <span className={styles.detailValue}>{product.kind}</span>
              </li>

              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Срок годности:</span>
                <span className={styles.detailValue}>{product.shelf} дней</span>
              </li>

              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Вес:</span>
                <span className={styles.detailValue}>{product.weight} г</span>
              </li>

              <li className={styles.descriptionItem}>
                <span className={styles.detailLabel}>Описание:</span>
                <div className={styles.descriptionBox}>
                  {product.description || "Описание отсутствует"}
                </div>
              </li>

              <li className={styles.ingredientsItem}>
                <span className={styles.detailLabel}>Состав:</span>
                <ul className={styles.ingredientsList}>
                  {product.ingredients?.length > 0 ? (
                    product.ingredients.map((ingredient, index) => (
                      <li key={index} className={styles.ingredient}>
                        • {ingredient.ingredient_name}{" "}
                        <span className={styles.ingredientWeight}>
                          ({ingredient.weight}г)
                        </span>
                        {ingredient.allergen && (
                          <span className={styles.allergenBadge}>аллерген</span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className={styles.noIngredients}>Состав не указан</li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
          <div className={styles.buy_block}>
            <AddToCartButton cart={cart} product={product} addToCart={addToCart} decreaseQuantity={decreaseQuantity}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
