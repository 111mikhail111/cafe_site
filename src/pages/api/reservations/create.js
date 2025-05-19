import  pool  from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    tableId,
    cafeId,
    date,
    time,
    customerName,
    guestCount,
    clientId = null, // необязательный параметр
  } = req.body;

  // Валидация данных
  if (!tableId || !cafeId || !date || !time || !customerName || !guestCount) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Проверяем, не забронирован ли уже этот слот
    const existing = await pool.query(
      `SELECT id FROM reservations 
       WHERE table_id = $1 AND reservation_date = $2 AND reservation_time = $3`,
      [tableId, date, time]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // Создаем бронирование
    const result = await pool.query(
      `INSERT INTO reservations 
       (table_id, cafe_id, reservation_date, reservation_time, customer_name, client_id, guest_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [tableId, cafeId, date, time, customerName, clientId, guestCount]
    );

    res.status(201).json({
      success: true,
      reservationId: result.rows[0].id,
      message: "Reservation created successfully",
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Error creating reservation",
      error: error.message,
    });
  }
}
