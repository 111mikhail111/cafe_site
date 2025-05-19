import React, { useEffect, useState } from "react";
import UiButton from "../UI/UiButton";
import styles from "./CartList.module.css"; // Импортируем CSS модуль
import { useCart } from "@/lib/CartContext";
import Link from "next/link";


const CartList = () => {
  const { cart, addToCart, decreaseQuantity } = useCart();
  // Пример данных корзины (замените на ваши реальные данные)

  useEffect(() => {
        console.log(cart);
  }, [cart])
  // Функция для отображения содержимого корзины
  const displayCart = (cart) => {
    if (cart.length === 0) {
      return <p className={styles.cartEmptyMessage}>Ваша корзина пуста.</p>;
    }

    return (
      <>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemPrice}>{item.price} ₽</span>
            <div className={styles.quantityControls}>
              <UiButton
                variant="outline"
                size="icon"
                className={`${styles.quantityButton} rounded-full`}
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </UiButton>
              <span className={styles.itemQuantity}>{item.quantity}</span>
              <UiButton
                variant="outline"
                size="icon"
                className={`${styles.quantityButton} rounded-full`}
                onClick={() => addToCart(item)}
              >
                +
              </UiButton>
            </div>
          </div>
        ))}
        {/* Подсчитываем итоговую сумму */}
        {(() => {
          const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          return (
            <div className={styles.totalInfo}>
              <span className={styles.totalLabel}>Итого:</span>
              <span className={styles.totalAmount}>{total} ₽</span>
            </div>
          );
        })()}
        <Link href="/pay">
          <UiButton
            className={`${styles.checkoutButton} mt-6 w-full`}
            variant="default"
            
          >
            Перейти к оплате
          </UiButton>
        </Link>
      </>
    );
  };

  const changeQuantity = (itemId, change) => {
    setcart((prevcart) => {
      const updatedCart = prevcart.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) {
            return { ...item, quantity: 1 };
          }
          console.log(
            `Продукт ${item.name}: ${change > 0 ? "+" : ""}${change}`
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedCart;
    });
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Содержимое корзины</h1>
      <div id="cart-list" className={styles.cartList}>
        {displayCart(cart)}
      </div>
    </div>
  );
};

export default CartList;
