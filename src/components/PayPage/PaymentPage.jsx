import React, { useEffect, useState } from "react";
import styles from "./PaymentPage.module.css";
import UiButton from "../UI/UiButton";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/router";
import { useClient } from "@/lib/ClientContext";

const PaymentPage = () => {
  const { cart, clearCart } = useCart();
  const { client } = useClient();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Подсчет итоговой суммы
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateFinalTotal = () => {
    if (useLoyaltyPoints && cardData) {
      // Конвертируем баллы в рубли (предположим 1 балл = 1 рубль)
      const pointsValue = Math.min(cardData.points, total);
      return total - pointsValue;
    }
    return total;
  };

  const finalTotal = calculateFinalTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Создаем заказ и получаем его ID
      const orderId = await createOrder();

      // Добавляем оплату
      await addPayment(orderId);

      if (useLoyaltyPoints && cardData) {
        const pointsUsed = Math.min(cardData.points, total);
        setCardData({
          ...cardData,
          points: cardData.points - pointsUsed
        });
        await fetch(`/api/loyality-card-update-points?clientId=${client.id}&points=${pointsUsed}&ifget=false`);
      }
      else {
        if (!useLoyaltyPoints && cardData) {
          const recievedPoints = Math.round(finalTotal * 0.05);
          await fetch(`/api/loyality-card-update-points?clientId=${client.id}&points=${recievedPoints}&ifget=true`);
        }
      }

      // Очищаем корзину и перенаправляем на страницу подтверждения
      clearCart();
      router.push(`/profile`);
    } catch (err) {
      console.error("Ошибка оплаты:", err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Функция для создания заказа
  const createOrder = async () => {
    const orderResponse = await fetch("/api/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cafeId: 1,
        clientPhone: client.phone,
        sum: finalTotal,
        employeeId: null,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    if (!orderResponse.ok) {
      throw new Error("Не удалось создать заказ");
    }

    const { order } = await orderResponse.json();
    return order.id;
  };

  // Функция для добавления оплаты
  const addPayment = async (orderId) => {
    console.log("Sending payment:", {
      orderId,
      amount: total,
      paymentMethod: paymentMethod === "card" ? 2 : 1,
    });
    const paymentResponse = await fetch("/api/payment/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        amount: finalTotal,
        paymentMethod: paymentMethod === "card" ? 2 : 1, // 2 - карта, 1 - наличные
      }),
    });

    if (!paymentResponse.ok) {
      throw new Error("Не удалось обработать оплату");
    }
  };

  useEffect(() => {
    const fetchLoyaltyCard = async () => {
      try {
        const response = await fetch(`/api/loyalty-card?clientId=${client.id}`);
        const data = await response.json();

        if (data.card) {
          setCardData(data.card);
        }
      } catch (error) {
        console.error("Ошибка при загрузке карты лояльности:", error);
      }
    };

    if (client) {
      fetchLoyaltyCard();
    }
  }, [client]);

  

  return (
    <div className={styles.paymentContainer}>
      <h1 className={styles.paymentTitle}>Оформление заказа</h1>

      <div className={styles.paymentContent}>
        <div className={styles.orderSummary}>
          <h2 className={styles.sectionTitle}>Ваш заказ</h2>
          <div className={styles.itemsList}>
            {cart.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemQuantity}>×{item.quantity}</span>
                <span className={styles.itemPrice}>
                  {item.price * item.quantity} ₽
                </span>
              </div>
            ))}
          </div>

          <div className={styles.totalSection}>
            {cardData && (
              <div className={styles.loyaltyRow}>
                <div className={styles.loyaltyInfo}>
                  <span className={styles.loyaltyText}>
                    Баланс карты лояльности:
                  </span>
                  <span className={styles.loyaltyPoints}>
                    {cardData.points} баллов
                  </span>
                </div>
                <label className={styles.loyaltyToggle}>
                  <span className={styles.toggleText}>Списать</span>
                  <input
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            )}

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Сумма заказа:</span>
              <div className={styles.totalAmountContainer}>
                {useLoyaltyPoints && cardData && (
                  <span className={styles.originalTotal}>{total} ₽</span>
                )}
                <span className={styles.finalTotal}>{finalTotal} ₽</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.paymentForm}>
          <h2 className={styles.sectionTitle}>Способ оплаты</h2>

          <div className={styles.paymentMethods}>
            <label className={styles.paymentMethod}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <div className={styles.methodContent}>
                <span className={styles.methodName}>Банковская карта</span>
                <span className={styles.methodDescription}>
                  Оплата по терминалу
                </span>
              </div>
            </label>

            <label className={styles.paymentMethod}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <div className={styles.methodContent}>
                <span className={styles.methodName}>Наличными</span>
                <span className={styles.methodDescription}>При получении</span>
              </div>
            </label>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <UiButton
            type="submit"
            variant="default"
            className={styles.submitButton}
            disabled={isProcessing || cart.length === 0}
          >
            {isProcessing ? "Обработка..." : "Оплатить заказ"}
          </UiButton>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
