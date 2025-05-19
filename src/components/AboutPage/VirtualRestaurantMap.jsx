import React, { useState, useEffect, useCallback } from "react";
import styles from "./VirtualRestaurantMap.module.css";
import { FiCalendar, FiClock, FiX } from "react-icons/fi";
import { useClient } from "@/lib/ClientContext";
import { useAddresses } from "@/lib/AddressContext";

const ALL_TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];



export default function VirtualRestaurantMap({setIsLoadingProp}) {
  const {client} = useClient();
  
  
  const [tables, setTables] = useState([]);
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservationData, setReservationData] = useState({
    time: "",
    name: "",
    guests: 1,
  });
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { addresses, selectedAddress, setSelectedAddress } = useAddresses();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsLoadingProp(false);
      }, 2000); // 2000 миллисекунд = 2 секунды

      // Очищаем таймер при размонтировании компонента
      return () => clearTimeout(timer);
    }
    if (isLoading) {
      setIsLoadingProp(true);
    }
  }, [isLoading, setIsLoadingProp]);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedTable || !selectedDate) return;
  
    setIsModalLoading(true);
    setModalError(null);
    setAvailableSlots([]);
  
    try {
      const response = await fetch(
        `/api/tables/${selectedTable.id}/booked-slots?cafe_id=${selectedAddress}&date=${selectedDate}`
      );
      
      if (!response.ok) {
        throw new Error("Не удалось загрузить доступные слоты");
      }
  
      const data = await response.json();
      const bookedSlots = data.bookedSlots || [];
  
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
  
      const isToday = new Date(selectedDate).toDateString() === now.toDateString();
  
      const available = ALL_TIME_SLOTS.filter(slot => {
        if (bookedSlots.includes(slot)) return false;
        
        if (isToday) {
          const [hours, minutes] = slot.split(':').map(Number);
          const slotTime = new Date();
          slotTime.setHours(hours, minutes, 0, 0);
          
          return slotTime > now;
        }
        
        return true;
      });
  
      setAvailableSlots(available);
      
      if (reservationData.time && !available.includes(reservationData.time)) {
        setReservationData(prev => ({ ...prev, time: "" }));
      }
    } catch (err) {
      console.error("Ошибка загрузки слотов:", err);
      setModalError(err.message);
    } finally {
      setIsModalLoading(false);
    }
  }, [selectedTable, selectedDate, selectedAddress, reservationData.time]);

  

  useEffect(() => {
    if (selectedTable) {
      fetchAvailableSlots();
    }
    if (!selectedTable) {
      setModalError(null);
      setAvailableSlots([]);
      setReservationData({ time: "", name: "", guests: 1 });
    }
  }, [selectedTable, selectedDate, fetchAvailableSlots]);

  useEffect(() => {
    const fetchLayoutData = async () => {
      if (!selectedAddress) return;

      setIsLoading(true);
      setError(null);
      setSelectedTable(null);

      try {
        const response = await fetch(`/api/cafe/${selectedAddress}/layout`);

        if (!response.ok) {
          throw new Error(
            `Ошибка ${response.status}: ${
              response.statusText || "Не удалось загрузить данные"
            }`
          );
        }

        const data = await response.json();

        if (data.success && data.layout) {
          setTables(data.layout.tables || []);
          setPlants(data.layout.plants || []);
        } else {
          throw new Error(data.message || "Ошибка в данных ответа API");
        }
      } catch (err) {
        console.error("Ошибка при загрузке макета кафе:", err);
        setError(err.message);
        setTables([]);
        setPlants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayoutData();
  }, [selectedAddress]);

  const handleCafeChange = (event) => {
    setselectedAddress(Number(event.target.value));
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTable(null);
  };

  const handleTableClick = (table) => {
    if (isLoading || !selectedDate) return;
    setSelectedTable(table);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseInt(value, 10) || 1 : value;
    setReservationData((prev) => ({ ...prev, [name]: val }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTable || !selectedDate || !reservationData.time) {
      setModalError("Пожалуйста, выберите доступное время.");
      return;
    }
  
    if (reservationData.guests > selectedTable.seats) {
      setModalError(`Количество гостей превышает вместимость стола (макс. ${selectedTable.seats})`);
      return;
    }
  
    setIsModalLoading(true);
    setModalError(null);
  
    try {
      const response = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: selectedTable.id,
          cafeId: selectedAddress,
          date: selectedDate,
          time: reservationData.time,
          customerName: reservationData.name,
          guestCount: reservationData.guests,
          ...(client && { clientId: client.id })
        })
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Не удалось забронировать столик");
      }
  
      alert(
        `Стол #${selectedTable.id} успешно забронирован для ${reservationData.name} на ${selectedDate} в ${reservationData.time}\nНомер брони: ${result.reservationId}`
      );
      
      setSelectedTable(null);
      setReservationData({
        time: "",
        name: "",
        guests: 1,
      });
      
      fetchAvailableSlots();
      
    } catch (err) {
      console.error("Ошибка бронирования:", err);
      setModalError(err.message || "Произошла ошибка при бронировании");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedAddress(selectedValue);
  };

  return (
    <div className={styles.csContainer}>
      <h1 className={styles.csTitle}>Бронирование столиков</h1>
      
      <div className={styles.controlsCard}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Выберите кафе:</label>
          <select
            value={selectedAddress || ""}
            onChange={handleAddressChange}
            disabled={isLoading}
            className={styles.controlSelect}
          >
            {addresses.map((cafe) => (
              <option key={cafe.id} value={cafe.id}>
                {cafe.address}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Выберите дату:</label>
          <div className={styles.dateInputWrapper}>
            <FiCalendar className={styles.dateIcon} />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              disabled={isLoading}
              required
              className={styles.controlDateInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.mapCard}>
        <h2 className={styles.mapTitle}>Выберите столик на карте</h2>
        <p className={styles.mapSubtitle}>
          Нажмите на свободный столик для бронирования
        </p>

        {isLoading && (
          <div className={styles.loadingOverlay}>
            <p>Загрузка макета кафе...</p>
          </div>
        )}
        {error && (
          <div className={styles.errorOverlay}>
            <p>Ошибка: {error}</p>
          </div>
        )}

        <div className={`${styles.map} ${isLoading ? styles.mapLoading : ""}`}>
          {!isLoading && !error && (
            <>
              <div className={styles.floor}></div>
              <img
                src="/info-desk.png"
                alt="Инфо стойка"
                className={styles.infoDesk}
              />

              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`${styles.table} ${
                    true ? styles.available : styles.booked
                  }`}
                  style={{
                    left: `${table.position.x}%`,
                    top: `${table.position.y}%`,
                    width: `${table.seats * 10 + 40}px`,
                    height: `${table.seats * 10 + 40}px`,
                  }}
                  onClick={() => handleTableClick(table)}
                >
                  <img
                    src="/table.png"
                    alt={`Стол #${table.id}`}
                    className={styles.tableImage}
                  />
                  <span className={styles.tableSeats}>{table.seats}</span>
                  <span className={styles.tableLabel}>Стол #{table.id}</span>
                </div>
              ))}

              {plants.map((plant) => (
                <img
                  key={plant.id}
                  src={plant.src}
                  alt={`Декоративное растение (${plant.type})`}
                  className={styles.plant}
                  style={{
                    position: "absolute",
                    left: `${plant.position.x}%`,
                    top: `${plant.position.y}%`,
                    width: `${plant.size.width}px`,
                    height: `${plant.size.height}px`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {selectedTable && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedTable(null)}
              disabled={isModalLoading}
            >
              <FiX size={24} />
            </button>

            <h2 className={styles.modalTitle}>
              Бронирование стола #{selectedTable.id}
            </h2>
            <div className={styles.modalInfo}>
              <p><strong>Дата:</strong> {selectedDate}</p>
              <p><strong>Вместимость:</strong> до {selectedTable.seats} человек</p>
            </div>

            <form
              onSubmit={handleReservationSubmit}
              className={styles.reservationForm}
            >
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Время бронирования:</label>
                <div className={styles.inputWithIcon}>
                  <FiClock className={styles.inputIcon} />
                  <select
                    name="time"
                    value={reservationData.time}
                    onChange={handleInputChange}
                    required
                    className={styles.formInput}
                    disabled={isModalLoading || availableSlots.length === 0}
                  >
                    <option value="" disabled>
                      {isModalLoading
                        ? "Загрузка слотов..."
                        : availableSlots.length === 0
                        ? "Нет доступных слотов"
                        : "Выберите время"}
                    </option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ваше имя:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={reservationData.name}
                  onChange={handleInputChange}
                  id="name"
                  required
                  className={styles.formInput_name}
                  disabled={isModalLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Количество гостей:</label>
                <div className={styles.guestsControl}>
                  <input
                    type="number"
                    name="guests"
                    min="1"
                    max={selectedTable.seats}
                    value={reservationData.guests}
                    onChange={handleInputChange}
                    required
                    className={styles.guestsInput}
                    disabled={isModalLoading}
                  />
                  <span className={styles.guestsHint}>макс. {selectedTable.seats}</span>
                </div>
              </div>

              {modalError && (
                <div className={styles.modalError}>
                  {modalError}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isModalLoading || !reservationData.time}
              >
                {isModalLoading ? "Обработка..." : "Забронировать стол"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}