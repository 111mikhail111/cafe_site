import React, { createContext, useState, useContext, useEffect } from "react";

// Создаем контекст
const CartContext = createContext();

// Провайдер контекста
export const CartProvider = ({ children }) => {
  // Загружаем корзину из localStorage при инициализации (только на клиенте)
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Сохраняем корзину в localStorage при каждом изменении (только на клиенте)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Функция добавления товара в корзину
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Если товар уже есть в корзине, увеличиваем его количество
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Если товара нет в корзине, добавляем его с количеством 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Функция уменьшения количества товара в корзине
  const decreaseQuantity = (productId) => {
    const existingProductIndex = cart.findIndex((item) => item.id === productId);

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingProductIndex].quantity > 1) {
        // Если количество больше 1, уменьшаем его
        updatedCart[existingProductIndex].quantity -= 1;
      } else {
        // Если количество равно 1, удаляем товар из корзины
        updatedCart.splice(existingProductIndex, 1);
      }
      setCart(updatedCart);
    }
  };

  // Функция удаления товара из корзины
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Значение, которое будет доступно всем потребителям контекста
  const value = {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Хук для использования контекста
export const useCart = () => {
  return useContext(CartContext);
};