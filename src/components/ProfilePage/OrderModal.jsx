"use client";
import { useState, useEffect } from "react";
import styles from "./OrderModal.module.css";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const OrderModal = ({ order, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "В процессе";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return { text: "Завершен", color: "#4CAF50", icon: "✓" };
      case "in_progress":
        return { text: "В процессе", color: "#FFC107", icon: "🔄" };
      case "canceled":
        return { text: "Отменен", color: "#F44336", icon: "✕" };
      default:
        return { text: "Новый", color: "#2196F3", icon: "🆕" };
    }
  };

  const statusInfo = getStatusInfo(order.stat);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!order) return null;
  // else console.log("заказик", order); // Закомментируем или удалим консоль

  return (
    <div
      className={`${styles.modalOverlay} ${isVisible ? styles.visible : ""}`}
      onClick={handleClose} // Закрытие по клику вне модалки
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику внутри модалки
      >
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>

        <div className={styles.modalHeader}>
          <h2>Детали заказа #{order.id}</h2>
          <div
            className={styles.statusBadge}
            style={{ backgroundColor: statusInfo.color }}
          >
            <span className={styles.statusIcon}>{statusInfo.icon}</span>
            {statusInfo.text}
          </div>
        </div>

        

        <div className={styles.orderTimeline}>
          <div className={styles.timelineItem}>
            <div
              className={styles.timelineDot}
              style={{ backgroundColor: "#4CAF50" }}
            ></div>
            <div className={styles.timelineContent}>
              <h4>Создан</h4>
              <p>{formatDate(order.timecr)}</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div
              className={styles.timelineDot}
              style={{
                backgroundColor: order.timetook ? "#4CAF50" : "#BDBDBD",
              }}
            ></div>
            <div className={styles.timelineContent}>
              <h4>Принят в работу</h4>
              <p>{formatDate(order.timetook)}</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div
              className={styles.timelineDot}
              style={{
                backgroundColor: order.timedone ? "#4CAF50" : "#BDBDBD",
              }}
            ></div>
            <div className={styles.timelineContent}>
              <h4>Завершен</h4>
              <p>{formatDate(order.timedone)}</p>
            </div>
          </div>
        </div>

        {/* Добавляем список товаров */}
        <div className={styles.productsList}>
          <h3>Товары в заказе:</h3>
          <div className={styles.productsHeader}>
            <span>Название</span>
            <span>Кол-во</span>
            <span>Сумма</span>
          </div>
          {order.products && order.products.length > 0 ? (
            order.products.map((item) => (
              <div key={item.id} className={styles.productItem}>
                <span className={styles.productName}>{item.name}</span>
                <span className={styles.productAmount}>{item.amount} шт.</span>
                <span className={styles.productPrice}>
                  {(item.price * item.amount).toFixed(2)} ₽
                </span>
              </div>
            ))
          ) : (
            <p>Список товаров пуст.</p>
          )}
        </div>
        {/* Конец списка товаров */}

        <div className={styles.orderSummary}>
          <div className={styles.summaryItem}>
            <span>Общее количество</span>
            <span>{order.amount} шт.</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Итого к оплате</span>
            <span className={styles.totalPrice}>{order.sum.toFixed(2)} ₽</span>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.printButton}
            onClick={() => generateOrderPDF(order)}
          >
            <span className={styles.buttonIcon}>🖨️</span>
            Печать
          </button>
          <button className={styles.closeModalButton} onClick={handleClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;

// Оставшиеся функции formatDate, getStatusInfo, generateOrderPDF остаются без изменений
const formatDate = (dateString) => {
  if (!dateString) return "Не завершено";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  } catch {
    return dateString;
  }
};

const getStatusInfo = (status) => {
  switch (status) {
    case "completed":
      return { text: "Завершен", color: "#4CAF50", icon: "✓" };
    case "in_progress":
      return { text: "В процессе", color: "#FFC107", icon: "🔄" };
    case "canceled":
      return { text: "Отменен", color: "#F44336", icon: "✕" };
    default:
      return { text: "Новый", color: "#2196F3", icon: "🆕" };
  }
};

const generateOrderPDF = async (order) => {
  try {
    // Создаем новый PDF документ
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Загружаем кастомный шрифт с поддержкой кириллицы
    // Убедитесь, что файл шрифта доступен по этому пути
    const fontUrl = "/fonts/Dimbo Russian.otf";
    const fontResponse = await fetch(fontUrl);
    const fontBytes = await fontResponse.arrayBuffer();

    // Встраиваем шрифты
    const font = await pdfDoc.embedFont(fontBytes);
    const fontBold = await pdfDoc.embedFont(fontBytes, {
      customName: "Roboto-Bold", // Можно дать другое имя, если нужно
    });

    // Добавляем страницу
    const page = pdfDoc.addPage([595, 842]); // A4 размер в points

    // Настройки
    const primaryColor = rgb(41 / 255, 49 / 255, 32 / 255);
    const secondaryColor = rgb(72 / 255, 86 / 255, 56 / 255);
    const margin = 50;
    let yPosition = 800;
    const itemHeight = 15; // Высота строки для товара
    const tableHeaderHeight = 20; // Высота строки заголовка таблицы

    // Заголовок
    page.drawText(`Заказ #${order.id}`, {
      x: margin,
      y: yPosition,
      size: 20,
      font: fontBold,
      color: primaryColor,
    });
    yPosition -= 30;

    // Статус заказа
    const statusInfo = getStatusInfo(order.stat);
    page.drawText(`Статус: ${statusInfo.text}`, {
      x: margin,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(
        parseInt(statusInfo.color.slice(1, 3), 16) / 255,
        parseInt(statusInfo.color.slice(3, 5), 16) / 255,
        parseInt(statusInfo.color.slice(5, 7), 16) / 255
      ),
    });
    yPosition -= 30;

    // Информация о клиенте
    page.drawText("Клиент:", {
      x: margin,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: secondaryColor,
    });
    page.drawText(order.client, {
      x: margin + 60, // Скорректируем отступ для имени клиента
      y: yPosition,
      size: 12,
      font: font,
      color: secondaryColor,
    });
    yPosition -= 30;

    // Хронология заказа
    page.drawText("Хронология заказа:", {
      x: margin,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: secondaryColor,
    });
    yPosition -= 20;

    const timelineData = [
      { label: "Создан", date: formatDate(order.timecr) },
      { label: "Принят в работу", date: formatDate(order.timetook) },
      { label: "Завершен", date: formatDate(order.timedone) },
    ];

    timelineData.forEach((item) => {
      if (yPosition < margin + 30) { // Проверка на выход за границу страницы
        page = pdfDoc.addPage([595, 842]);
        yPosition = 800 - margin;
      }
      page.drawText(`- ${item.label}:`, {
        x: margin,
        y: yPosition,
        size: 10,
        font: fontBold,
        color: secondaryColor,
      });
      page.drawText(item.date, {
        x: margin + 100,
        y: yPosition,
        size: 10,
        font: font,
        color: secondaryColor,
      });
      yPosition -= 15;
    });
    yPosition -= 15;

    // Детали заказа (список товаров)
    page.drawText("Товары:", { // Изменили заголовок
      x: margin,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: secondaryColor,
    });
    yPosition -= 20;

    // Заголовки таблицы
    if (yPosition < margin + tableHeaderHeight + order.products.length * itemHeight) {
         page = pdfDoc.addPage([595, 842]);
         yPosition = 800 - margin;
    }
    page.drawText("Название", {
      x: margin,
      y: yPosition,
      size: 10,
      font: fontBold,
      color: primaryColor,
    });
    page.drawText("Кол-во", {
      x: margin + 250,
      y: yPosition,
      size: 10,
      font: fontBold,
      color: primaryColor,
    });
    page.drawText("Сумма", {
      x: margin + 350,
      y: yPosition,
      size: 10,
      font: fontBold,
      color: primaryColor,
    });
    yPosition -= 15;

    // Элементы заказа
    const orderItems = order.products || [];
    orderItems.forEach((item) => {
       if (yPosition < margin + itemHeight) { // Проверка на выход за границу страницы
         page = pdfDoc.addPage([595, 842]);
         yPosition = 800 - margin;
       }
      page.drawText(item.name, {
        x: margin,
        y: yPosition,
        size: 10,
        font: font,
        color: secondaryColor,
      });
      page.drawText(item.amount.toString(), {
        x: margin + 250,
        y: yPosition,
        size: 10,
        font: font,
        color: secondaryColor,
      });
      page.drawText(`${(item.price * item.amount).toFixed(2)} р.`, {
        x: margin + 350,
        y: yPosition,
        size: 10,
        font: font,
        color: secondaryColor,
      });
      yPosition -= 15;
    });
    yPosition -= 20;

    // Итоговая сумма
    if (yPosition < margin + 30) { // Проверка на выход за границу страницы
      page = pdfDoc.addPage([595, 842]);
      yPosition = 800 - margin;
    }
    page.drawText("Итого:", {
      x: margin + 250,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: secondaryColor,
    });
    page.drawText(`${order.sum.toFixed(2)} рублей`, {
      x: margin + 350,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: primaryColor,
    });

    // Сохраняем PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Заказ_${order.id}.pdf`;
    link.click();
  } catch (error) {
    console.error("Ошибка при создании PDF:", error);
  }
};