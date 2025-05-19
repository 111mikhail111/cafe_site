import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Метод не разрешен" });
  }

  const { orderId, amount, paymentMethod, transactionId = null } = req.body;

  if (!orderId || !amount || !paymentMethod) {
    return res.status(400).json({
      message: "Не указаны все обязательные параметры",
      required: ["orderId", "amount", "paymentMethod"],
    });
  }

  try {
    // Вызываем хранимую процедуру для добавления оплаты
    await pool.query("CALL add_payment($1, $2, $3, $4)", [
      orderId,
      amount,
      paymentMethod,
      transactionId,
    ]);

    // Получаем обновленную информацию о заказе
    const { rows } = await pool.query(
      "SELECT * FROM get_payment_by_order_id($1)",
      [orderId]
    );

    res.status(201).json({
      success: true,
      message: "Оплата успешно добавлена",
      payment: rows[0],
    });
  } catch (error) {
    console.error("Ошибка при добавлении оплаты:", error);

    // Проверяем, если ошибка о несуществующем заказе
    if (error.message.includes("does not exist")) {
      return res.status(404).json({
        success: false,
        message: "Заказ не найден",
      });
    }

    res.status(500).json({
      success: false,
      message: "Ошибка при добавлении оплаты",
      error: error.message,
    });
  }
}
