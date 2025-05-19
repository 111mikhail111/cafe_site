import React, { useState, useMemo } from "react";
import styles from "./OrderHistory.module.css";

const OrderHistory = ({ orders, onOrderClick }) => {
  const [sortBy, setSortBy] = useState("date"); // 'date' или 'total'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' или 'desc'

  const sortedOrders = useMemo(() => {
    // Создаем глубокую копию массива orders, чтобы избежать мутации
    const deepCopy = JSON.parse(JSON.stringify(orders));

    const sortMultiplier = sortOrder === "asc" ? 1 : -1;

    const sorted = deepCopy.sort((a, b) => {
      if (sortBy === "date") {
        return sortMultiplier * (new Date(a.timecr) - new Date(b.timecr));
      } else if (sortBy === "total") {
        return sortMultiplier * (a.sum - b.sum);
      }
      return 0; // Никогда не должно произойти
    });

    return sorted;
  }, [orders, sortBy, sortOrder]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Переключаем порядок сортировки, если кликнули на текущий выбранный фильтр
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Устанавливаем новый фильтр и сбрасываем порядок сортировки на "desc"
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className={styles.orderHistory}>
      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <>
          <div className={styles.orderHistoryHeader}>
            <button
              className={`${styles.sortButton} ${
                sortBy === "date" ? styles.active : ""
              }`}
              onClick={() => handleSortChange("date")}
            >
              Дата {sortBy === "date" && (sortOrder === "asc" ? "▲" : "▼")}
            </button>
            <button
              className={`${styles.sortButton} ${
                sortBy === "total" ? styles.active : ""
              }`}
              onClick={() => handleSortChange("total")}
            >
              Сумма {sortBy === "total" && (sortOrder === "asc" ? "▲" : "▼")}
            </button>
          </div>
          <ul className={styles.orderList}>
            {sortedOrders.map((order) => (
              <li
                key={order.id}
                className={styles.orderItem}
                onClick={() => onOrderClick(order)}
              >
                <span className={styles.orderId}>Заказ № {order.id}</span>
                <span className={styles.orderDate}>
                  {new Date(order.timecr).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className={styles.orderTotal}>{order.sum} руб.</span>
                <span className={styles.orderTotal}>{order.stat}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
