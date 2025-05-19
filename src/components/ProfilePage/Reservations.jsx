import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiUser, FiMapPin, FiX } from "react-icons/fi";
import styles from "./Reservations.module.css";

export default function UserReservations({ clientId }) {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `/api/reservations/get_from_user?clientId=${clientId}`
        );

        if (!response.ok) {
          throw new Error("Не удалось загрузить бронирования");
        }

        const data = await response.json();
        console.log(data);
        setReservations(data || []);
      } catch (err) {
        console.error("Ошибка загрузки бронирований:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [clientId]);

  const handleCancelReservation = async (reservationId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reservations/delete?reservationId=${reservationId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Не удалось отменить бронирование");
      }

      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      setCancelModal(null);
    } catch (err) {
      console.error("Ошибка отмены бронирования:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long", // Добавляем день недели
      };
      return date.toLocaleDateString("ru-RU", options);
    } catch (e) {
      console.error("Ошибка форматирования даты:", e);
      return dateString;
    }
  };

  const getGuestWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "гостей";
    if (lastDigit === 1) return "гость";
    if (lastDigit >= 2 && lastDigit <= 4) return "гостя";
    return "гостей";
  };

  return (
    <div className={styles.csContainer}>
      <h1 className={styles.csTitle}>Мои бронирования</h1>

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <p>Загрузка ваших бронирований...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorOverlay}>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && reservations.length === 0 && (
        <div className={styles.emptyState}>
          <p>У вас пока нет активных бронирований</p>
        </div>
      )}

      <div className={styles.csGrid}>
        {reservations.map((reservation) => (
          <div key={reservation.id} className={styles.csCard}>
            <div className={styles.csCardContent}>
              <h2 className={styles.csCardTitle}>{reservation.cafe_name}</h2>

              <div className={styles.reservationInfo}>
                <div className={styles.infoItem}>
                  <FiCalendar className={styles.infoIcon} />
                  <span>{formatDate(reservation.reservation_date)}</span>
                </div>

                <div className={styles.infoItem}>
                  <FiClock className={styles.infoIcon} />
                  <span>{reservation.reservation_time}</span>
                </div>

                <div className={styles.infoItem}>
                  <FiUser className={styles.infoIcon} />
                  <span>
                    {reservation.guest_count}{" "}
                    {getGuestWord(reservation.guest_count)}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <FiMapPin className={styles.infoIcon} />
                  <span>
                    Стол #{reservation.table_id} (до {reservation.table_seats}{" "}
                    чел.)
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.customerName}>
                    Имя: {reservation.customer_name}
                  </span>
                </div>
              </div>
            </div>

            <button
              className={styles.cancelButton}
              onClick={() => setCancelModal(reservation.id)}
              disabled={isLoading}
            >
              Отменить бронь
            </button>
          </div>
        ))}
      </div>

      {cancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setCancelModal(null)}
              disabled={isLoading}
            >
              <FiX size={24} />
            </button>

            <h2 className={styles.modalTitle}>Отменить бронирование</h2>

            <p>Вы уверены, что хотите отменить это бронирование?</p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelConfirmButton}
                onClick={() => handleCancelReservation(cancelModal)}
                disabled={isLoading}
              >
                {isLoading ? "Отмена..." : "Да, отменить"}
              </button>

              <button
                className={styles.modalSecondaryButton}
                onClick={() => setCancelModal(null)}
                disabled={isLoading}
              >
                Нет, оставить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
